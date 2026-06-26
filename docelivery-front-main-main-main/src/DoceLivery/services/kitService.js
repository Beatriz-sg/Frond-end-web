import ApiService from './api';

class KitService {
    _buildFormData(kitPayload, imagemFile) {
        const formData = new FormData();
        // Limpa campos promocionais se o kit não está em oferta
        const payload = {
            ...kitPayload,
            emOferta: kitPayload.emOferta === true,
            precoPromocional:
                kitPayload.emOferta === true
                    ? (kitPayload.precoPromocional || null)
                    : null,
        };
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        formData.append('kit', blob);
        if (imagemFile) formData.append('imagem', imagemFile);
        return formData;
    }

    /**
     * Salva um novo kit com suporte a upload de imagem
     * @param {Object} dadosDoKit - Objeto com os dados do kit
     * @param {File} imagemArquivo - Arquivo de imagem (opcional)
     * @returns {Promise} Resposta da API
     */
    async salvarKit(dadosDoKit, imagemArquivo) {
        const formData = new FormData();
        formData.append('imagem', imagemArquivo);
        formData.append('kit', new Blob([JSON.stringify(dadosDoKit)], { type: 'application/json' }));

        // Faz a chamada para a API passando o formData
        return await ApiService.post("/produtos/kit", formData);
    }

    async createKit(kitPayload, imagemFile = null) {
        return await ApiService.post('/produtos/kit', this._buildFormData(kitPayload, imagemFile));
    }

    async updateKit(id, kitPayload, imagemFile = null) {
        return await ApiService.put(`/produtos/kit/${id}`, this._buildFormData(kitPayload, imagemFile));
    }

    async deleteKit(id) {
        return await ApiService.delete(`/produtos/kit/${id}`);
    }
}

export default new KitService();