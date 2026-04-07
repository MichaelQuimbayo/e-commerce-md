import React, { useState } from 'react';
import { useCart } from '../src/shared/context/CartContext';
import Navbar from '../src/shared/components/Navbar';
import { ChevronDown, HelpCircle, CreditCard, ShoppingCart } from 'lucide-react';

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// --- Sub-components for styling ---
const InputField = ({ id, label, optional = false, fullWidth = false, ...props }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <label htmlFor={id} className="sr-only">{label}</label>
        <input
            id={id}
            name={id}
            placeholder={label + (optional ? ' (opcional)' : '')}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            {...props}
        />
    </div>
);

const SelectField = ({ id, label, options, fullWidth = false }) => (
    <div className={`relative ${fullWidth ? 'col-span-2' : ''}`}>
        <label htmlFor={id} className="sr-only">{label}</label>
        <select
            id={id}
            name={id}
            className="w-full appearance-none bg-white px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
    </div>
);

const RadioSelect = ({ value, label, sublabel, selected, onChange, icon }) => (
    <div
        onClick={() => onChange(value)}
        className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all ${
            selected ? 'border-blue-600 ring-2 ring-blue-500' : 'border-stone-300'
        }`}
    >
        <div className="flex items-center">
            <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected ? 'border-blue-600 bg-blue-600' : 'border-stone-400'
                }`}
            >
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="ml-4 font-medium text-sm">{label}</span>
        </div>

        <div className="flex items-center gap-2">
            {icon}
            {sublabel && <span className="font-semibold text-sm">{sublabel}</span>}
        </div>
    </div>
);

// Order Summary
const OrderSummary = ({ cartItems, getCartTotal, shippingCost, total }) => (
    <div>
        <div className="space-y-5">
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.variantId} className="flex items-center gap-4">

                        <div className="relative w-16 h-16 rounded-lg bg-stone-200 border border-stone-200">
                            <img
                                src={item.image || 'https://via.placeholder.com/64'}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-stone-600 rounded-full">
                {item.quantity}
              </span>
                        </div>

                        <div className="flex-grow">
                            <h3 className="font-semibold text-sm text-stone-800">{item.name}</h3>
                            <p className="text-sm text-stone-500">
                                {item.size} / {item.color}
                            </p>
                        </div>

                        <p className="font-semibold text-sm text-stone-800">
                            {formatCurrency(item.price * item.quantity)}
                        </p>

                    </div>
                ))
            ) : (
                <p className="text-stone-600">No hay productos en el carrito.</p>
            )}
        </div>

        <div className="border-t border-stone-200 mt-8 pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(getCartTotal())}</span>
            </div>

            <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-medium">{formatCurrency(shippingCost)}</span>
            </div>
        </div>

        <div className="border-t border-stone-200 mt-6 pt-6">
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
        </div>
    </div>
);

// Mobile accordion
const MobileOrderSummary = ({ cartItems, getCartTotal, shippingCost, total }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleFormSubmit = () => {
        const form = document.getElementById('checkout-form');
        if (form) form.requestSubmit();
    };

    return (
        <div className="lg:hidden bg-stone-50 border-b border-stone-200">

            <div className="p-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center"
                >
                    <h2 className="text-lg font-medium flex items-center gap-2 text-black">
                         Resumen del pedido

                    </h2>

                    <div className="flex flex items-center gap-2">
                        <span className="font-bold text-lg text-stone-800">
                            {formatCurrency(total)}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                </button>

            </div>

            {isOpen && (
                <div className="p-4 border-t border-stone-200">

                    <OrderSummary
                        cartItems={cartItems}
                        getCartTotal={getCartTotal}
                        shippingCost={shippingCost}
                        total={total}
                    />

                </div>
            )}
            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-md hover:bg-blue-700 transition-colors"
                >
                    Pagar ahora
                </button>
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    const { cartItems, getCartTotal } = useCart();
    const [billingAddress, setBillingAddress] = useState('same');

    const shippingCost = 18000;
    const total = getCartTotal() + shippingCost;

    return (
        <div className="bg-stone-50 min-h-screen font-sans">

            <Navbar />

            <main>



                <div className="lg:grid lg:grid-cols-2">

                    {/* FORMULARIO */}
                    <div className="py-12 px-4 sm:px-6 lg:border-r lg:pl-12 xl:pl-20  lg:pb-12">

                        <div className="max-w-lg lg:max-w-lg lg:w-full lg:ml-auto lg:mr-0">


                            <form id="checkout-form" className="space-y-8">

                                <section>
                                    <h2 className="text-xl font-semibold mb-4">Contacto</h2>
                                    <InputField
                                        id="email"
                                        label="Email o número de teléfono móvil"
                                        fullWidth
                                        type="email"
                                    />
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4">Entrega</h2>

                                    <div className="grid grid-cols-2 gap-4">

                                        <SelectField
                                            id="country"
                                            label="País/Región"
                                            options={[{ value: 'co', label: 'Colombia' }]}
                                            fullWidth
                                        />

                                        <InputField id="firstName" label="Nombre" />
                                        <InputField id="lastName" label="Apellidos" />

                                        <InputField id="cedula" label="Cédula" fullWidth />
                                        <InputField id="address" label="Dirección" fullWidth />

                                        <InputField
                                            id="apartment"
                                            label="Casa, apartamento, etc."
                                            optional
                                            fullWidth
                                        />

                                        <InputField id="city" label="Ciudad" />

                                        <SelectField
                                            id="state"
                                            label="Provincia / Estado"
                                            options={[{ value: 'meta', label: 'Meta' }]}
                                        />

                                        <InputField id="postalCode" label="Código postal" optional />

                                        <div className="col-span-2 relative">
                                            <InputField
                                                id="phone"
                                                label="Teléfono"
                                                type="tel"
                                                fullWidth
                                            />
                                            <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                        </div>

                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4">Métodos de envío</h2>

                                    <RadioSelect
                                        value="nacional"
                                        label="Envío Nacional"
                                        sublabel={formatCurrency(shippingCost)}
                                        selected={true}
                                        onChange={() => {}}
                                    />
                                </section>

                                <section>
                                    <h2 className="text-xl font-semibold mb-4">Pago</h2>

                                    <p className="text-sm text-stone-500 mb-4">
                                        Todas las transacciones son seguras y están encriptadas.
                                    </p>

                                    <RadioSelect
                                        value="bold"
                                        label="Bold"
                                        icon={<CreditCard size={20} />}
                                        selected={true}
                                        onChange={() => {}}
                                    />
                                </section>

                                <section>

                                    <h2 className="text-xl font-semibold mb-4">
                                        Dirección de facturación
                                    </h2>

                                    <div className="space-y-3">

                                        <RadioSelect
                                            value="same"
                                            label="La misma dirección de envío"
                                            selected={billingAddress === 'same'}
                                            onChange={setBillingAddress}
                                        />

                                        <RadioSelect
                                            value="different"
                                            label="Usar una dirección de facturación distinta"
                                            selected={billingAddress === 'different'}
                                            onChange={setBillingAddress}
                                        />

                                    </div>

                                    {billingAddress === 'different' && (

                                        <div className="mt-6 pt-6 border-t border-stone-200">

                                            <div className="grid grid-cols-2 gap-4">

                                                <SelectField
                                                    id="billing_country"
                                                    label="País/Región"
                                                    options={[{ value: 'co', label: 'Colombia' }]}
                                                    fullWidth
                                                />

                                                <InputField id="billing_firstName" label="Nombre" />
                                                <InputField id="billing_lastName" label="Apellidos" />

                                                <InputField
                                                    id="billing_company"
                                                    label="Empresa"
                                                    optional
                                                    fullWidth
                                                />

                                                <InputField id="billing_address" label="Dirección" fullWidth />

                                                <InputField
                                                    id="billing_apartment"
                                                    label="Casa, apartamento, etc."
                                                    optional
                                                    fullWidth
                                                />

                                                <InputField id="billing_city" label="Ciudad" />

                                                <SelectField
                                                    id="billing_state"
                                                    label="Provincia / Estado"
                                                    options={[{ value: 'meta', label: 'Meta' }]}
                                                />

                                                <InputField id="billing_postalCode" label="Código postal" optional />

                                                <div className="col-span-2 relative">

                                                    <InputField
                                                        id="billing_phone"
                                                        label="Teléfono"
                                                        type="tel"
                                                        optional
                                                        fullWidth
                                                    />

                                                    <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

                                                </div>

                                            </div>

                                        </div>

                                    )}


                                </section>
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    className="hidden lg:block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-md hover:bg-blue-700 transition-colors"
                                >
                                    Pagar ahora
                                </button>
                                <MobileOrderSummary
                                    cartItems={cartItems}
                                    getCartTotal={getCartTotal}
                                    shippingCost={shippingCost}
                                    total={total}
                                />

                            </form>

                        </div>

                    </div>

                    {/* RESUMEN DEL PEDIDO */}

                    <div className="hidden lg:block bg-stone-100">

                        <div className="py-12 px-4 sm:px-6 lg:pr-12 xl:pr-20 sticky top-0 h-screen overflow-y-auto">

                            <div className="max-w-lg lg:w-full lg:ml-0 lg:mr-auto">

                                <h2 className="text-xl font-semibold mb-6">
                                    Resumen del pedido
                                </h2>

                                <OrderSummary
                                    cartItems={cartItems}
                                    getCartTotal={getCartTotal}
                                    shippingCost={shippingCost}
                                    total={total}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default CheckoutPage;