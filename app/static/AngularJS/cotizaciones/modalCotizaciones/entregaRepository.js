var entregaURL = global_settings.urlCORS + 'api/entrega/';


registrationModule.factory('entregaRepository', function($http) {
    return {
        getDirecciones: function(data) {
            return $http({
                url: entregaURL + 'index/',
                method: "GET",
                params: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});