registrationModule.controller('historialController', function($sce, $scope, $rootScope, $location, $timeout, alertFactory, historialRepository, filterFactory, userFactory, globalFactory, pedidoRepository) {



    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
    };



    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {
                console.log(result.data, 'Soy las empresas ')
                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                //SET EMPRESA LOCALSTORAGE   BEGIN
                if (localStorage.getItem('histEmpresa') !== null) {

                    $scope.histEmpresa = []

                    $scope.tempHistEmp = localStorage.getItem('histEmpresa')
                    $scope.histEmpresa.push(JSON.parse($scope.tempHistEmp))

                    console.log('$scope.histEmpresa')
                    console.log($scope.histEmpresa[0][0])

                    setTimeout(function() {

                        $("#selEmpresas").val($scope.histEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.histEmpresa[0][0]; //$scope.empresas;

                        $scope.consultaSucursales();
                    }, 100);

                } //SET EMPRESA LOCALSTORAGE  END

            } else {
                alertFactory.success('No se encontraron empresas');
            }
        });

    };


    $scope.cambioEmpresa = function() {
        if ($scope.empresaActual.emp_idempresa != 0) {

            $scope.histEmpresa = []
            console.log('empresa actual')
            console.log($scope.empresaActual)
            //console.log($scope.empresaActual)

            $scope.histEmpresa.push({
                emp_idempresa: $scope.empresaActual.emp_idempresa,
                emp_nombre: $scope.empresaActual.emp_nombre,
                emp_nombrecto: $scope.empresaActual.emp_nombrecto
            })
            //$scope.histEmpresa.push($scope.empresaActual);
            localStorage.setItem('histEmpresa', JSON.stringify($scope.histEmpresa));
            //}

            $scope.consultaSucursales();

        } else {
            $scope.sucursales = $scope.sucursalActual = null;
            localStorage.removeItem('histEmpresa')
            localStorage.removeItem('histSucursal')
        }
    };

    $scope.cambioSucursal = function(empresa, sucursal, fecha, fechaFin) {
        var f = new Date();
        $scope.fechaFin = ('0' + f.getDate()).slice(-2) + "/" + ('0' + (f.getMonth() + 1)).slice(-2) + "/" + f.getFullYear();
        //Consigue 30 dias antes de la fecha actual
        var fI = new Date();
        fI.setDate(fI.getDate() - 30);
        $scope.fecha = ('0' + fI.getDate()).slice(-2) + "/" + ('0' + (fI.getMonth() + 1)).slice(-2) + "/" + fI.getFullYear();
        $scope.consultaPedidos(empresa, sucursal, $scope.fecha, $scope.fechaFin);


        console.log($scope.sucursalActual)

        if ($scope.sucursalActual.AGENCIA != 0) {

            $scope.histSucursal = []
            console.log('sucursal actual')
            console.log($scope.sucursalActual)
            //console.log($scope.empresaActual)

            $scope.histSucursal.push({
                AGENCIA: $scope.sucursalActual.AGENCIA,
                NOMBRE_AGENCIA: $scope.sucursalActual.NOMBRE_AGENCIA,
                IDSUC: $scope.sucursalActual.IDSUC,
                suc_nombrecto: $scope.sucursalActual.suc_nombrecto
            })
            //$scope.histEmpresa.push($scope.empresaActual);
            console.log('agregando sucursal actual a localStorage')
            localStorage.setItem('histSucursal', JSON.stringify($scope.histSucursal));
        } else {
            localStorage.removeItem('histSucursal')
        }
    };



    $scope.consultaSucursales = function() {
        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {
                $scope.sucursales = result.data;
                $scope.sucursalActual = $scope.sucursales[0];
                //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
                if (localStorage.getItem('histSucursal') !== null) {

                    $scope.histSucursal = []

                    //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                    $scope.tempHistSuc = localStorage.getItem('histSucursal')
                    $scope.histSucursal.push(JSON.parse($scope.tempHistSuc))

                    console.log('$scope.histSucursal')
                    console.log($scope.histSucursal[0][0])

                    setTimeout(function() {

                        $("#selSucursales").val($scope.histSucursal[0][0].AGENCIA);
                        $scope.sucursalActual = $scope.histSucursal[0][0]; //$scope.empresas;

                        var f = new Date();
                        $scope.fechaFin = ('0' + f.getDate()).slice(-2) + "/" + ('0' + (f.getMonth() + 1)).slice(-2) + "/" + f.getFullYear();
                        //Consigue 30 dias antes de la fecha actual
                        var fI = new Date();
                        fI.setDate(fI.getDate() - 30);
                        $scope.fecha = ('0' + fI.getDate()).slice(-2) + "/" + ('0' + (fI.getMonth() + 1)).slice(-2) + "/" + fI.getFullYear();
                        $scope.consultaPedidos($scope.empresaActual, $scope.sucursalActual, $scope.fecha, $scope.fechaFin);

                    }, 100);

                } //SET SUCURSAL DESDE LOCALSTORAGE   END
            }
        });
    };

    $scope.consultaPedidos = function(empresa, sucursal, fecha, fechaFin) {



        var modifechaInic = fecha.split('/') //'07/10/2016'.split('/');//nuevocontrato.fechaInicio.split('/');
        var newDateIni = modifechaInic[2] + modifechaInic[1] + modifechaInic[0] //modifechaInic[1] + '/' + modifechaInic[0] + '/' + modifechaInic[2];
        var modifechaTerm = fechaFin.split('/') //'10/10/2016'.split('/');//nuevocontrato.fechaTermino.split('/');
        var newDateterm = modifechaTerm[2] + modifechaTerm[1] + modifechaTerm[0]

        pedidoRepository.busquedaPedido($scope.Usuario.idUsuario, 2, empresa.emp_idempresa, sucursal.AGENCIA, newDateIni, newDateterm).then(function(result) {
            if (result.data.length > 0) {
                $scope.listaPedidos = result.data
                console.log($scope.listaPedidos)
                $('#tblHistoricoFiltros').DataTable().destroy();

                setTimeout(function() {
                    $scope.setTablePaging('tblHistoricoFiltros');

                    $("#tblHistoricoFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                    $("#tblHistoricoFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

                }, 1);

            } else {
                alertFactory.historial('No se encontraron resultados');
                $scope.listaPedidos = [];
                $('#tblHistoricoFiltros').DataTable().destroy();
            }
        });
    }; //fin consultaPedido



    $scope.detalleHistorial = function(pedido) {
        console.log('Seleccionado');
        console.log($scope.Usuario);
        $scope.color = pedido.color;
        $scope.colorEstatus = {
            "background-color": pedido.color
        }

        pedidoRepository.busquedaPedidoUsuarioDetalle(pedido.idPedidoRef, $scope.Usuario.idUsuario).then(function(result) {
            //     console.log(result.data);

            if (result.data.data.length > 0) {

                $scope.detalles = result.data.data;
                $scope.empresa = result.data

                console.log($scope.detalles);
                console.log('-----------------------------------------')
                console.log($scope.empresa)

                var i = 0;
                $scope.subtotal = 0;
                angular.forEach($scope.detalles, function(value, key) {
                    $scope.subtotal += $scope.detalles[i].totalItem;
                    i++;
                });

                $scope.idpedido = pedido.idPedidoRef;
                //console.log($scope.detalles.length);

                $scope.totalPedido = 0;

                result.data.data.forEach(function(entry) {
                    $scope.totalPedido += entry.totalItem;
                }, this);

            }


            // $scope.empresa = {
            //     Nombre: 'Andrade',
            //     FECHAPEDIDO: '30/01/2018',
            //     DIRECCION: 'Calle X Numero #45',
            //     TELEFONO: 123456,
            //     DIRCLIENTE: 'calle Y #70',
            //     CORREOCLIENTE: 'p@gmail.com',
            //     TELCLIENTE: 987654
            // };
            // $scope.detalles = [
            //     { PTS_IDPARTE: 10151111, PTS_DESPARTE: 'Sensor de estacionamiento', PTS_PCOLISTA: 10000, prd_cantidadsolicitada: 1, color: '#003744', estatusPieza: 'SURTIDO', idPedidoBPRO: 0056, totalItem: 10000 },
            //     { PTS_IDPARTE: 20000002, PTS_DESPARTE: 'Bobina', PTS_PCOLISTA: 400, prd_cantidadsolicitada: 1, color: '#003744', estatusPieza: 'SURTIDO', idPedidoBPRO: 0057, totalItem: 400 },
            //     { PTS_IDPARTE: 34444555, PTS_DESPARTE: 'Bujia', PTS_PCOLISTA: 100, prd_cantidadsolicitada: 4, color: '#003744', estatusPieza: 'SURTIDO', idPedidoBPRO: 0058, totalItem: 400 },
            // ];


            $('#modalDetalleHistorial').modal('show');


        });
    };



    $scope.imprimir = function() {

        var rptStructure = {};
        rptStructure.refacciones = $scope.detalles;

        rptStructure.empresa = [{
            'idpedido': $scope.idpedido,
            'FECHAPEDIDO': $scope.empresa.FECHAPEDIDO,
            'NOMBRE': $scope.empresa.NOMBRE,
            'DIRECCION': $scope.empresa.DIRECCION,
            'name': $scope.Usuario.nombreUsuario,
            'TELEFONO': $scope.empresa.TELEFONO,
            'DIRCLIENTE': $scope.empresa.DIRCLIENTE,
            'CORREOCLIENTE': $scope.empresa.CORREOCLIENTE,
            'TELCLIENTE': $scope.empresa.TELCLIENTE,
            'subtotal': $scope.subtotal,
            'iva': ($scope.subtotal * .16),
            'total': $scope.totalPedido + ($scope.subtotal * .16),
            'colorEstatus': $scope.color,
            'estatus': 'HISTORICO'
        }];


        var jsonData = {
            "template": { "name": "facturaRefacciones_rpt" },
            "data": rptStructure
        }

        $scope.generarPDF(jsonData);

    };




    $scope.generarPDF = function(jsonData) {
        new Promise(function(resolve, reject) {


            resolve(jsonData);
        }).then(function(jsonData) {
            pedidoRepository.getReportePdf(jsonData).then(function(result) {
                var file = new Blob([result.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                window.open($scope.rptResumenConciliacion);
                //    $('#reporteModalPdf').modal('show'); 
            });
        });



    };

    $scope.setTablePaging = function(idTable) {
        $('#' + idTable).DataTable({
            dom: '<"html5buttons"B>lTfgitp',
            order: [0, 'desc'],
            buttons: [{
                extend: 'copy'
            }, {
                extend: 'csv'
            }, {
                extend: 'excel',
                title: 'ExampleFile'
            }, {
                extend: 'pdf',
                title: 'ExampleFile'
            }, {
                extend: 'print',
                customize: function(win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');
                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }]
        });
    }; //end setTablePaging


});