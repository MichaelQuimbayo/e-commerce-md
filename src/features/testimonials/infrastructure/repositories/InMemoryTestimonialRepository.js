import { ITestimonialRepository } from '../../domain/repositories/ITestimonialRepository';
import { testimonials } from '../data/testimonials';

export class InMemoryTestimonialRepository extends ITestimonialRepository {
  constructor() {
    super();
    this.testimonials = testimonials;
  }

  async getAllTestimonials() {
    return Promise.resolve(this.testimonials);
  }
}
