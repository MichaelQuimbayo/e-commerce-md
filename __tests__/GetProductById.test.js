import { GetProductById } from '../src/core/usecases/GetProductById';
import { IProductRepository } from '../src/core/ports/IProductRepository';

// 1. Creamos un "mock" del repositorio.
// Esta es una implementación falsa que controlamos para el test.
class MockProductRepository extends IProductRepository {
  async getProductById(id) {
    if (id === '1') {
      return { id: 1, name: 'Producto de Prueba', price: '$10.00' };
    }
    return null;
  }
}

describe('GetProductById Use Case', () => {
  it('debe devolver un producto si se encuentra', async () => {
    // Arrange: Preparamos el escenario
    const mockRepo = new MockProductRepository();
    const getProductById = new GetProductById(mockRepo);

    // Act: Ejecutamos la acción
    const product = await getProductById.execute('1');

    // Assert: Verificamos el resultado
    expect(product).not.toBeNull();
    expect(product.id).toBe(1);
    expect(product.name).toBe('Producto de Prueba');
  });

  it('debe devolver null si el producto no se encuentra', async () => {
    // Arrange
    const mockRepo = new MockProductRepository();
    const getProductById = new GetProductById(mockRepo);

    // Act
    const product = await getProductById.execute('999');

    // Assert
    expect(product).toBeNull();
  });

  it('debe lanzar un error si no se proporciona un ID', async () => {
    // Arrange
    const mockRepo = new MockProductRepository();
    const getProductById = new GetProductById(mockRepo);

    // Assert
    // Usamos .rejects.toThrow() para verificar que una promesa es rechazada con un error.
    await expect(getProductById.execute(null)).rejects.toThrow('El ID del producto es requerido.');
  });
});
