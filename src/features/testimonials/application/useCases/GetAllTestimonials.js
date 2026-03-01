import { ITestimonialRepository } from '../../domain/repositories/ITestimonialRepository';

export class GetAllTestimonials {
  constructor(testimonialRepository) {
    if (!(testimonialRepository instanceof ITestimonialRepository)) {
      throw new Error("testimonialRepository debe ser una instancia de ITestimonialRepository.");
    }
    this.testimonialRepository = testimonialRepository;
  }

  async execute() {
    return this.testimonialRepository.getAllTestimonials();
  }
}
