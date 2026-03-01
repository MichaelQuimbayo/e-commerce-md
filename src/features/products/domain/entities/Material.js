// To parse this data:
//
//   const Convert = require("./file");
//
//   const material = Convert.toMaterial(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toMaterial(json) {
  return cast(JSON.parse(json), a(r("Material")));
}

function materialToJson(value) {
  return JSON.stringify(uncast(value, a(r("Material"))), null, 2);
}

function invalidValue(typ, val, key, parent = '') {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ) {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ) {
  if (typ.jsonToJS === undefined) {
    const map = {};
    typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ) {
  if (typ.jsToJSON === undefined) {
    const map = {};
    typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val, typ, getProps, key = '', parent = '') {
  function transformPrimitive(typ, val) {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs, val) {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases, val) {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
  }

  function transformArray(typ, val) {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val) {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(props, additional, val) {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
        : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
                : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast(val, typ) {
  return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
  return transform(val, typ, jsToJSONProps);
}

function l(typ) {
  return { literal: typ };
}

function a(typ) {
  return { arrayItems: typ };
}

function u(...typs) {
  return { unionMembers: typs };
}

function o(props, additional) {
  return { props, additional };
}

function m(additional) {
  return { props: [], additional };
}

function r(name) {
  return { ref: name };
}

const typeMap = {
  "Material": o([
    { json: "id", js: "id", typ: "" },
    { json: "is_variant", js: "is_variant", typ: true },
    { json: "status", js: "status", typ: 0 },
    { json: "codes", js: "codes", typ: a(r("Code")) },
    { json: "descriptions", js: "descriptions", typ: a(r("Description")) },
    { json: "features", js: "features", typ: a("any") },
    { json: "values", js: "values", typ: a(r("Value")) },
    { json: "variants", js: "variants", typ: a("any") },
    { json: "created_at", js: "created_at", typ: Date },
    { json: "created_by", js: "created_by", typ: "" },
    { json: "updated_at", js: "updated_at", typ: null },
    { json: "searchableDescription", js: "searchableDescription", typ: "" },
    { json: "resources", js: "resources", typ: a(r("Resource")) },
    { json: "labels", js: "labels", typ: a(r("Label")) },
  ], false),
  "Code": o([
    { json: "code", js: "code", typ: "" },
    { json: "code_type_lbl", js: "code_type_lbl", typ: "" },
    { json: "status", js: "status", typ: 0 },
  ], false),
  "Description": o([
    { json: "lang", js: "lang", typ: "" },
    { json: "value", js: "value", typ: "" },
  ], false),
  "Label": o([
    { json: "entity_type", js: "entity_type", typ: "" },
    { json: "value", js: "value", typ: "" },
    { json: "status", js: "status", typ: 0 },
  ], false),
  "Resource": o([
    { json: "content_type", js: "content_type", typ: "" },
    { json: "url", js: "url", typ: "" },
    { json: "name", js: "name", typ: "" },
    { json: "status", js: "status", typ: 0 },
    { json: "tags", js: "tags", typ: "" },
  ], false),
  "Value": o([
    { json: "entity_type", js: "entity_type", typ: "" },
    { json: "value", js: "value", typ: 0 },
    { json: "status", js: "status", typ: 0 },
  ], false),
};

module.exports = {
  "materialToJson": materialToJson,
  "toMaterial": toMaterial,
};