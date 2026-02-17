// Puerto: Define el contrato que cualquier repositorio de testimonios debe cumplir.
export class ITestimonialRepository {
  async getAllTestimonials() {
    throw new Error("Método 'getAllTestimonials()' no implementado.");
  }
}
