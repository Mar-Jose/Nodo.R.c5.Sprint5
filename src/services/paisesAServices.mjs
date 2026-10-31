import paisesARepository from '../repositories/paisesARepository.mjs';

class paisesAServices {
    
    async obtenerTodos() {
        return await paisesARepository.getAll();
    }
    async obtenerPorId(id) {
        const pais = await paisesARepository.getById(id);
        if (!pais) {
            throw new Error('País no encontrado');
        }
        return pais;
    }
    async crearPais(data) {
        const paisNormalizado = this.normalizarPais(data);
        const existePais = await paisesARepository.existsByNombre(paisNormalizado.nombreOficial);
        if (existePais) {
            throw new Error('El país ya existe');
        }

        return await paisesARepository.create(paisNormalizado);
    }

    async editarPais(id, data) {
        const paisActualizado = await paisesARepository.update(id, this.normalizarPais(data));
        if (!paisActualizado) {
            throw new Error('No se pudo actualizar el país');
        }
        return paisActualizado;
    }
    async eliminarPais(id) {
        const paisEliminado = await paisesARepository.delete(id);
        if (!paisEliminado) {
            throw new Error('No se pudo eliminar el país');
        }
        return paisEliminado;
    }
    async buscarPaisPorAtributo(atributo, valor) {
        return await paisesARepository.buscarPorAtributo(atributo, valor);
    }

    normalizarPais(data) {
        const comoTexto = (valor) => {
            if (Array.isArray(valor)) return valor.join(', ').trim();
            return typeof valor === 'string' ? valor.trim() : '';
        };

        return {
            nombreOficial: comoTexto(data.nombreOficial || data.nombreOfficial),
            capital: comoTexto(data.capital),
            languages: comoTexto(data.languages),
            borders: comoTexto(data.borders).split(/[,\s]+/).filter(Boolean).join(', '),
            area: Number(data.area),
            image: comoTexto(data.image),
        };
    }
}
export default new paisesAServices();