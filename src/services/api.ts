// Adicionamos o "Promise<{ data: any }>" para o TypeScript parar de reclamar das tipagens

export const api = {
    get: async (url: string, config?: any): Promise<{ data: any }> => {
        if (url === '/category') return { data: [{ id: '1', name: 'Cervejas' }, { id: '2', name: 'Lanches' }] };
        if (url === '/category/product') return { data: [] };
        if (url === '/orders') return { data: [{ id: '1', tableId: '5', name: 'Mesa 5', status: 'OPEN', total: 0, table: { number: '5' } }] };
        if (url === '/orders/closed') return { data: [] };
        if (url === '/sales') return { data: [] };
        return { data: [] };
    },
    
    post: async (url: string, data?: any): Promise<{ data: any }> => ({ data: { success: true } }),
    
    put: async (url: string, data?: any): Promise<{ data: any }> => ({ data: { success: true } }),
    
    delete: async (url: string, config?: any): Promise<{ data: any }> => ({ data: { success: true } }),
    
    defaults: {
        headers: {
            Authorization: ''
        }
    }
};