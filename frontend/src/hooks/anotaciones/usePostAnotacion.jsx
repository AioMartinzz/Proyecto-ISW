import { postAnotacion } from '@services/anotacion.service.js';

const usePostAnotacion = (fetchAnotaciones) => {
    const handlePostAnotacion = async (anotacionData) => {
        try {
            await postAnotacion(anotacionData);
            if (fetchAnotaciones && anotacionData.alumnoId) {
                await fetchAnotaciones(anotacionData.alumnoId);
            }
        } catch (error) {
            console.error('Error creating anotacion:', error);
            throw new Error('Error al crear la anotación.');
        }
    };

    return { handlePostAnotacion };
};

export default usePostAnotacion;
