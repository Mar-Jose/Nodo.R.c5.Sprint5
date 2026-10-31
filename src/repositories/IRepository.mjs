class IRepository {
  async getAll() {
    throw new Error('Método getAll() no implementado')
  }

  async getById() {
    throw new Error('Método getById() no implementado')
  }

  async create() {
    throw new Error('Método create() no implementado')
  }

  async update() {
    throw new Error('Método update() no implementado')
  }

  async delete() {
    throw new Error('Método delete() no implementado')
  }

  async buscarPorAtributo() {
    throw new Error("Método 'buscarPorAtributo()' no implementado")
  }
}

export default IRepository
