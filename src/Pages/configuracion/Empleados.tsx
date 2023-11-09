import { useContext, useState, useEffect, CSSProperties, ChangeEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../../Context/AuthContext';
import { ContextAuthType } from '../../Interfaces.ts/AuthInterface';
import { get, post, put, remove } from '../../Axios/AxiosService';
//import { sinImagen } from '../Assets/sinimagen.jpg';
import { EmpleadoSearch, Sector, Localidad, Estadocivil, Nacionalidad, Pais, CentroCosto, Categoria, Turno, Seleccion, FrecuenciaPago, TipoEmpleado, Barrio, SubSector, Empleado, Sexo, Horario, SiNo, PorcentajeIps, Carrera, SalarioDetalle, SALARIOINICIAL, FUNCIONARIOINICIAL, ConceptosPreciosModel } from '../../Interfaces.ts/EmpleadoSearch';
import ModalData from '../../Components/ModalData';
import Select3 from '../../Components/Select3';
import Swal from 'sweetalert2';
import { BsFillTrash3Fill } from "react-icons/bs";
import Select from 'react-select';

const style: CSSProperties = {
    width: '242px',
    height: '200px',
};

export interface banderasLaboral {
    bnSalarioDetalles: boolean,
    bnHonorariosProfesionales: boolean,
    bnPorcentajeIps: boolean,
    bnIpsBase: boolean,
}

const BANDERAINIT = { bnSalarioDetalles: true, bnHonorariosProfesionales: true, bnPorcentajeIps: true, bnIpsBase: true, }

const Empleados = () => {
    const { globalData } = useContext<ContextAuthType>(AuthContext);
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const [empleado, setEmpleado] = useState<Empleado>(FUNCIONARIOINICIAL);
    const [empleadosSearch, setEmpleadosSearch] = useState<any[]>([]);
    const [empleadoSearch, setFunSearch] = useState<EmpleadoSearch>();
    const [auxConceptoPrecios, setAuxConceptoPrecios] = useState<ConceptosPreciosModel[]>([]);
    const [nacionalidades, setNacionalidades] = useState<any[]>([]);
    const [paises, setPaises] = useState<any[]>([]);
    const [localidades, setLocalidades] = useState<any[]>([]);
    const [barrios, setBarrios] = useState<any[]>([]);
    const [sectores, setSectores] = useState<any[]>([]);
    const [subSectores, setSubsectores] = useState<any[]>([]);
    const [estadosCiviles, setEstadosCiviles] = useState<any[]>([]);
    const [frecuenciasPago, setFrecuenciasPago] = useState<any[]>([]);
    const [tiposEmpleado, setTiposEmpleado] = useState<any[]>([]);
    const [centroscostos, setCentroscostos] = useState<any[]>([]);
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [selecciones, setSelecciones] = useState<any[]>([]);
    const [turnos, setTurnos] = useState<any[]>([]);
    const [horarios, setHorarios] = useState<any[]>([]);
    const [porcentajesIps, setPorcentajesIps] = useState<any[]>([{ id: '1', descripcion: 'EN BASE AL 9%' }, { id: '2', descripcion: 'EN BASE AL 25,5%' }, { id: '3', descripcion: 'NO POSEE IPS' },]);
    const [carreras, setCarreras] = useState<any[]>([]);
    const [personasHijos, setPersonasHijos] = useState<number>(0);
    const [empleadoFamilia, setEmpleadoFamilia] = useState<number>(0);
    const [salarioAdd, setSalarioAdd] = useState<SalarioDetalle>(SALARIOINICIAL);
    const [honorarioAdd, setHonorarioAdd] = useState<SalarioDetalle>(SALARIOINICIAL);
    const [honorarioActual, setHonorarioActual] = useState<number>(0);
    const [bandera, setBandera] = useState<banderasLaboral>(BANDERAINIT);
    const [insertSalario, setInsertSalario] = useState<Boolean>(false);
    const [insertHonorario, setInsertHonorario] = useState<Boolean>(false);
    const [showModalSalario, setShowModalSalario] = useState(false);
    const [showModalHonorario, setShowModalHonorario] = useState(false);

    //cambios de estado
    //=====SELECTORES
    const changeSelectFun = (item: any, name: string) => {
        console.log(item, name);
        (name == 'subSector') && traerConceptos(item);
        setEmpleado(prev => ({ ...prev, [name]: item }))
    };
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    //=====SELECTORES BUSCADOR
    const handleSelectChange = async (selectedItem: any) => {
        await setFunSearch(selectedItem);
        getEmpleadoById(selectedItem.id);

    };
    const onChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEmpleado(prev => ({ ...prev, [event.target.name]: (event.target.value) ? event.target.value : '' }))
    }
    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const value = typeof event.target.value === 'string' ? event.target.value.toUpperCase() : event.target.value;
        setEmpleado(prev => ({ ...prev, [event.target.name]: value }))
    }
    const onChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
        setEmpleado(prev => ({ ...prev, [event.target.name]: event.target.checked }))
    };

    const getEmpleados = async () => {
        try {
            const response = await get('/empleado/concat/');
            console.log(response.data);
            setEmpleadosSearch(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getEmpleadoById = async (id: number) => {
        try {
            const response = await get('/empleado/id/' + id);
            console.log(response.data);
            await setEmpleado(response.data as Empleado);
        } catch (error) {
            console.error(error);
        }
    }
    const getPaises = async () => {
        try {
            const response = await get('/pais/paises');
            setPaises(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    const getSelecciones = async () => {
        try {
            const response = await get('/seleccion/selecciones');
            setSelecciones(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getNacionalidades = async () => {
        try {
            const response = await get('/nacionalidad/nacionalidades');
            setNacionalidades(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getCategorias = async () => {
        try {
            const response = await get('/categoria/categorias');
            setCategorias(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    const getLocalidad = async () => {
        try {
            const response = await get('/localidad/localidades');
            setLocalidades(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getCentroCosto = async () => {
        try {
            const response = await get('/centrocosto/centroscosto');
            console.log('centros', response.data)
            setCentroscostos(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getCarreras = async () => {
        try {
            const response = await get('/carrera/carreras');
            setCarreras(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getSucursales = async () => {
        try {
            const response = await get('/sucursal/sucursales/');
            setSucursales(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getSectores = async () => {
        try {
            const response = await get('/sector/sectores/');
            setSectores(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    const getEstadosCiviles = async () => {
        try {
            const response = await get('/estadoCivil/estadosCiviles');
            setEstadosCiviles(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    const getFrecuenciaPago = async () => {
        try {
            const response = await get('/frecuenciapago/frecuenciaspago');
            setFrecuenciasPago(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getTiposEmpleado = async () => {
        console.log('getTiposEmpleado')
        try {
            const response = await get('/tipoempleado/tipos');
            setTiposEmpleado(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getTurnos = async () => {
        try {
            const response = await get('/turno/turnos/');
            setTurnos(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    const getHorariosByTurnoId = async (turnosId?: number, subSectorId?: number) => {
        try {
            const response = await get('/horario/turnosubsector/' + turnosId + '/' + subSectorId);
            setHorarios(response.data);
            console.log('horario', response.data)
        } catch (error) {
            console.error(error);
        }
    }
    const getSubSectorBySectorId = async (id: any) => {
        try {
            const response = await get('/subsector/sector/' + id);
            setSubsectores(response.data);
            console.log('subsector', response.data)
        } catch (error) {
            console.error(error);
        }
    }
    const getBarrioByLocalidadId = async (id: any) => {
        try {
            const response = await get('/barrio/localidad/' + id);
            setBarrios(response.data);
            console.log('barrio', response.data)
        } catch (error) {
            console.error(error);
        }
    }
 



    const getHonorarioByFuncId = async () => {
        try {
            const response = await get('/honorarioprofesional/fun/' + empleado?.id)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const getSalarioByFuncId = async () => {
        try {
            const response = await get('/salariodetalle/fun/' + empleado?.id)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    

    const traerConceptos = async (subSector: SubSector) => {
        try {
            const response = await get('/subSectorConcepto/subSector/' + subSector.id);
            let auxEmpConceptos: ConceptosPreciosModel[] = response.data as ConceptosPreciosModel[];
            if (auxEmpConceptos) {
                const modifiedConceptos = auxEmpConceptos.map(concepto => {
                    return {
                        ...concepto,
                        id: null,
                        activo: 'S',
                        precioConceptoses: concepto.precioConceptoses.map(precio => ({ ...precio, id: null, horaDesde: toTime(precio.horaDesde), horaHasta: toTime(precio.horaHasta) })),
                    }
                });
                setAuxConceptoPrecios(modifiedConceptos);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // al iniciar
    useEffect(() => {
        getEmpleados();
        getPaises();
        getNacionalidades();
        getEstadosCiviles()
        getLocalidad();
        getCentroCosto();
        getSucursales();
        getSectores();
        getCategorias();
        getTurnos();
        getSelecciones();
        getTiposEmpleado();
        getFrecuenciaPago();
        getCarreras();
    }, []);
    // al cambiar de empleado
    /*useEffect(() => {
        parceData();
    }, [empleado?.id]);*/
    //al cambiar un selector dependiente que son 3 

    useEffect(() => {
        console.log('change useeffect getHorariosByTurnoId'),
            (empleado?.turno != null && empleado?.subSector != null) && getHorariosByTurnoId(empleado?.turno.id, empleado?.subSector.id);
    }, [empleado?.id, empleado?.turno,]);
    useEffect(() => {
        console.log('change useeffect getSubSectorBySectorId'),
            (empleado?.sector) && getSubSectorBySectorId(empleado?.sector.id);
    }, [empleado?.id, empleado?.sector]);
    useEffect(() => {
        console.log('change useeffect getBarrioByLocalidadId'),
            (empleado?.localidad) && getBarrioByLocalidadId(empleado?.localidad.id);
    }, [empleado?.id, empleado?.localidad]);
    useEffect(() => {
        salarioChange()
    }, [empleado?.id]);
 
    
        const salarioChange = async () => { 
            if (empleado?.id) {
 
                         const historialHonorario = await getHonorarioByFuncId();
                         const historialSalario = await getSalarioByFuncId();
                
                            const index = (historialHonorario && historialHonorario?.length > 0) ? (historialHonorario.length - 1) : -1;
                            console.log(historialHonorario)
                            console.log(index)
                            if (index > -1) {
                                console.log(historialHonorario[index].monto)
                                console.log('index mayor a -1')
                                setHonorarioActual(historialHonorario[index].monto)
                            } else {
                                setHonorarioActual(0)
                            }
                            setEmpleado(prev => ({ ...prev, honorariosProfesionales: historialHonorario }))
                            setEmpleado(prev => ({ ...prev, salariosDetalle: historialSalario }))  
            }
        }
      




    const toTime = (timeString: any) => {
        if (timeString) {
            var timeTokens = timeString.toString().split(':');
            return new Date(1970, 0, 1, timeTokens[0], timeTokens[1], timeTokens[2]);

        } else {
            return null;
        }
    }


    const initBanderas = () => {
        if (empleado?.tipoEmpleado) {
            var opcion = empleado?.tipoEmpleado.id;
            if (opcion == 0 || opcion == undefined || opcion == null) {
                setBandera(BANDERAINIT);

            } else {
                switch (opcion) {
                    case 1:/*================= ================== Con ips =================================*/
                        setBandera({ bnSalarioDetalles: false, bnHonorariosProfesionales: true, bnPorcentajeIps: false, bnIpsBase: false, });

                        break;
                    case 2:/*=================================== prestador de servicio =================================*/
                        setBandera({ bnSalarioDetalles: true, bnHonorariosProfesionales: false, bnPorcentajeIps: true, bnIpsBase: true, });

                        break;
                    case 3:/*=================================== jubilado =================================*/
                        setBandera({ bnSalarioDetalles: false, bnHonorariosProfesionales: true, bnPorcentajeIps: true, bnIpsBase: true, });


                        break;
                    case 4:/*=================================== prestador de servicio con ips =================================*/
                        setBandera({ bnSalarioDetalles: false, bnHonorariosProfesionales: false, bnPorcentajeIps: false, bnIpsBase: false, });


                        break;
                    case 5:/*=================================== sin ips =================================*/
                        setBandera({ bnSalarioDetalles: false, bnHonorariosProfesionales: true, bnPorcentajeIps: true, bnIpsBase: true, });

                        break;
                    case 6:/*===================================  externos =================================*/
                        setBandera({ bnSalarioDetalles: false, bnHonorariosProfesionales: true, bnPorcentajeIps: false, bnIpsBase: true, });

                        break;
                }
            }
        }

    }


    useEffect(() => {
        if (empleado.personasHijos != null || empleado.personasHijos != undefined)
            setPersonasHijos(empleado.personasHijos.length);

        if (empleado.empleadoFamilias != null || empleado.empleadoFamilias != undefined)
            setEmpleadoFamilia(empleado.empleadoFamilias.length);
    }, [empleado]);

    const CloseModalSalario = () => {
        setShowModalSalario(false);
        setInsertSalario(false);
    };
    const OpenModalSalario = () => {
        setShowModalSalario(true);
    };
    const CloseModalHonorario = () => {
        setShowModalHonorario(false);
        setInsertHonorario(false);

    };
    const OpenModalHonorario = () => {
        setShowModalHonorario(true);
    };

    /************************************************************* SALARIOS *****************************************************/
    const guardarSalario = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(empleado)
        if (empleado && empleado?.id) {
            console.log('POST');
            try {
                const modif = await post('/salariosDetalle/' + empleado?.id, salarioAdd);
                const historialSalario = await getSalarioByFuncId();
                console.log(historialSalario)
                const salarioDetalles = historialSalario;
                const index = (salarioDetalles) ? (salarioDetalles.length - 1) : -1;
                (salarioDetalles) ? console.log(salarioDetalles[index]) : console.log(index);
                if (index && index >= 0) {
                    setEmpleado(prev => ({ ...prev, ['salariosDetalle']: historialSalario }))
                    setEmpleado(prev => ({ ...prev, ['salarioActual']: (salarioDetalles) ? salarioDetalles[index].monto : 0 }))
                } else {
                    setEmpleado(prev => ({ ...prev, ['salarioActual']: 0 }))
                }
                CloseModalSalario();
                setSalarioAdd(SALARIOINICIAL);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('ONMEMORY');
            console.log(empleado);
            let salarios: SalarioDetalle[];
            if (empleado?.salariosDetalle) {
                salarios = [...empleado?.salariosDetalle, salarioAdd];
            } else {
                salarios = [salarioAdd];
            }
            setEmpleado(prev => ({ ...prev, ['salariosDetalle']: salarios }))
            setEmpleado(prev => ({ ...prev, ['salarioActual']: salarioAdd.monto }))
            CloseModalSalario();
        }

    };

    const removeSalario = async (item: SalarioDetalle) => {
        console.log(item);
        try {
            if (empleado && empleado?.id) {
                const modif = await remove('/salariosDetalle/' + item?.id);
                const historialSalario = await getSalarioByFuncId();

                setEmpleado(prev => ({ ...prev, ['salariosDetalle']: historialSalario }))
                const index = (empleado?.salariosDetalle) ? (empleado?.salariosDetalle.length) - 1 : -1;
                if (index >= 0) {
                    setEmpleado(prev => ({
                        ...prev, ['salarioActual']: (empleado?.salariosDetalle) ? empleado?.salariosDetalle[index].monto : 0
                    }))
                } else {
                    setEmpleado(prev => ({ ...prev, ['salarioActual']: 0 }))
                }
            } else {
                setEmpleado(prev => ({ ...prev, ['salariosDetalle']: [] }))
                setEmpleado(prev => ({ ...prev, ['salarioActual']: 0 }))
            }
            setInsertSalario(false);
            setSalarioAdd(SALARIOINICIAL);
        } catch (error) {
            console.error(error);
        }
    };


    const removeHonorario = async (item: SalarioDetalle) => {
        console.log(item);
        try {
            if (empleado && empleado?.id) {
                const modif = await remove('/honorariosProfesionales/' + item?.id);
                const historialHonorario = await getHonorarioByFuncId();

                setEmpleado(prev => ({ ...prev, ['honorariosProfesionales']: historialHonorario }))
                const index = (empleado?.honorariosProfesionales) ? (empleado?.honorariosProfesionales.length) - 1 : -1;
                if (index >= 0) {
                    setHonorarioActual((empleado?.honorariosProfesionales) ? empleado?.honorariosProfesionales[index].monto : 0);
                } else {
                    setHonorarioActual(0);
                }
            } else {
                setEmpleado(prev => ({ ...prev, ['honorariosProfesionales']: [] }))
                setHonorarioActual(0);
            }
            setInsertHonorario(false);
            setHonorarioAdd(SALARIOINICIAL);
        } catch (error) {
            console.error(error);
        }
    };


    //Honorarios
    const guardarHonorario = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(empleado)
        if (empleado && empleado?.id) {
            console.log('POST');
            try {
                const modif = await post('/honorariosProfesionales/' + empleado?.id, honorarioAdd);
                const historialHonorario = await getHonorarioByFuncId();
                console.log(historialHonorario)
                const honorariosProfesionales = historialHonorario;
                const index = (honorariosProfesionales) ? (honorariosProfesionales.length - 1) : -1;
                (honorariosProfesionales) ? console.log(honorariosProfesionales[index]) : console.log(index);
                if (index && index >= 0) {
                    setEmpleado(prev => ({ ...prev, ['honorariosProfesionales']: historialHonorario }))
                    setHonorarioActual(honorarioAdd.monto)
                } else {
                    setHonorarioActual(0)
                }
                CloseModalHonorario();
                setHonorarioAdd(SALARIOINICIAL);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('ONMEMORY');
            console.log(empleado);
            let honorarios: SalarioDetalle[];
            if (empleado?.honorariosProfesionales) {
                honorarios = [...empleado?.honorariosProfesionales, honorarioAdd];
            } else {
                honorarios = [honorarioAdd];
            }
            setEmpleado(prev => ({ ...prev, ['honorariosProfesionales']: honorarios }))
            setHonorarioActual(honorarioAdd.monto)
            CloseModalHonorario();
        }

    };
    const onChangeSalarioAdd = (event: ChangeEvent<HTMLInputElement>) => {
        setSalarioAdd(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const onChangeHonrarioAdd = (event: ChangeEvent<HTMLInputElement>) => {
        setHonorarioAdd(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const enviarForm = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        getEmpleados();
        console.log('Formulario enviado');

        console.log(empleado)
        try {
            const newFun = {
                ...empleado,
                empresasId: globalData?.user.empresaId,
                honorariosProfesionales: empleado.honorariosProfesionales ? empleado.honorariosProfesionales : [],
                salariosDetalle: empleado.salariosDetalle ? empleado.salariosDetalle : [],
                salarioActual: empleado.salarioActual ? empleado.salarioActual : 0,
                anticipo: empleado.anticipo ? empleado.anticipo : 0,
                ipsBase: empleado.ipsBase ? empleado.ipsBase : 0,
                empleadoFamilias: [],
                personasHijos: [],
            }

            if (empleado?.id) {
                put('/empleados/', newFun)
                    .then(resp => {
                        console.log('MI RESPONSE')
                        console.log(resp)
                        put('/empleadoConceptos/empleado/updateActivo7' + resp.data.id);
                        post('/empleadoConceptos/empleado/' + resp.data.id, auxConceptoPrecios);
                        Swal.fire({
                            title: "El empleado se ha modificado con exito!!!",
                            text: "El registro se ha modificado con exito",
                            confirmButtonText: "Aceptar",
                        });
                    })
            } else {
                post('/empleados/', newFun)
                    .then(resp => {
                        console.log('MI RESPONSE')
                        getEmpleadoById(resp.data.id)
                        post('/empleadoConceptos/empleado/' + resp.data.id, auxConceptoPrecios);
                        console.log(resp)
                        Swal.fire({
                            title: "El empleado se ha creado con exito!!!",
                            text: "El registro se ha creado con exito",
                            confirmButtonText: "Aceptar",
                        });
                    })
            }

        } catch (error) {
            console.error(error);
        }

    };

    return (
        <>

            <div className='mb-3 card'>
                <div className='card-header-tab card-header-tab-animation card-header'>
                    <div className='card-header-title'>
                        Empleado
                    </div>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-lg-6 col-md-12 col-sm-12'>
                            {empleadosSearch ? (<Select3 options={empleadosSearch} valueKey="id" labelKey="concat" value={empleadoSearch} onChange={handleSelectChange} placeholder="Seleccione empleado"
                            />) : (
                                <div>Cargando...</div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <div className='mb-3 card' >
                <div className='card-header-tab card-header'>
                    <div className='card-header-title'>
                        LEGAJO {(empleado?.legajo ? <span>&nbsp;  N° {empleado?.legajo}</span> : '')}
                    </div>

                    <ul className='nav '>
                        <li className='nav-item'>
                            <a
                                className={activeTab === 'tab1' ? 'nav-link active' : 'nav-link'}
                                onClick={() => handleTabChange('tab1')}                              >
                                Datos Personales
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a
                                className={activeTab === 'tab2' ? 'nav-link active' : 'nav-link'}
                                onClick={() => handleTabChange('tab2')}                           >
                                Datos Laborales
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a
                                className={activeTab === 'tab3' ? 'nav-link active' : 'nav-link'}
                                onClick={() => handleTabChange('tab3')}
                            >
                                Datos Familiares
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className={activeTab === 'tab4' ? 'nav-link active' : 'nav-link'} onClick={() => handleTabChange('tab4')}                >
                                Datos Academicos
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='tab-content'>
                    <div className={activeTab === 'tab1' ? 'tab-pane fade show active' : 'tab-pane fade'}>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-3 col-md-12' >
                                    <div className=' mt-6 mb-3 card-body d-flex justify-content-center'>
                                        <img src={''} id='img' alt='Imagen' style={style} />
                                    </div>
                                    <div className=' mt-6 mb-3 card-body d-flex justify-content-center'>
                                        <div className='caption'>
                                            <p>
                                                <input onChange={onChangeInput} type='file' className='form-control' id='uploadedfile' file-model='myFile' placeholder=' ' />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-9 col-md-12'>
                                    <form onSubmit={enviarForm} >
                                        <div className='form-row'>
                                            <div className='col-md-4'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='nombre' className='form-label'>
                                                        Nombres
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='nombre' name='nombre' value={empleado?.nombre || ''} required />
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='ci' className='form-label'>
                                                        C.I.
                                                    </label>
                                                    <input
                                                        type='text'
                                                        className='form-control' onChange={onChangeInput}
                                                        id='ci'
                                                        name='ci'
                                                        value={empleado?.ci || ''}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='fechaNacimiento' className='form-label'>
                                                        Fecha Nacimiento:
                                                    </label>
                                                    <input onChange={onChangeInput} type='date'
                                                        id='fechaNacimiento'
                                                        name='fechaNacimiento'
                                                        value={empleado?.fechaNacimiento}
                                                        className='form-control' required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label className='form-label'>
                                                        Pais de Nacimiento
                                                    </label>
                                                    {paises ? (
                                                        <Select3 options={paises} valueKey="id" labelKey="descripcion"
                                                            value={empleado?.pais} onChange={(e) => changeSelectFun(e, 'pais')} placeholder="Seleccione pais" />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label className='form-label'>
                                                        Nacionalidad:
                                                    </label>

                                                    {nacionalidades ? (<Select3 options={nacionalidades} valueKey="id"
                                                        labelKey="descripcion" value={empleado?.nacionalidad} onChange={(e) => changeSelectFun(e, 'nacionalidad')} placeholder="Seleccione Nacionalidad"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='lugarNacimiento' className='form-label'>
                                                        Lugar Nacimiento:
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' value={empleado?.lugarNacimiento || ''}
                                                        id='lugarNacimiento'
                                                        name='lugarNacimiento'
                                                        className='form-control' required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='Localidad' className='form-label'>
                                                        Localidad:
                                                    </label>
                                                    {localidades ? (<Select3 options={localidades} valueKey="id" labelKey="descripcion" value={empleado?.localidad}
                                                        onChange={(e) => changeSelectFun(e, 'localidad')} placeholder="Seleccione Localidad"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='barrio' className='form-label'>
                                                        Barrio:
                                                    </label>
                                                    {barrios ? (<Select3 options={barrios} valueKey="id" labelKey="descripcion"
                                                        value={empleado?.barrio} onChange={(e) => changeSelectFun(e, 'barrio')} placeholder="Seleccione Barrio"
                                                    />) : (<div>Cargando...</div>)}

                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='direccion' className='form-label'>
                                                        Dirección:
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' id='direccion' name='direccion' className='form-control' value={empleado?.direccion || ''} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='telefono' className='form-label'>
                                                        Telefono
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='telefono' name='telefono' value={empleado?.telefono || ''} required />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='celular' className='form-label'>
                                                        Celular
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='celular' name='celular' value={empleado?.celular || ''} required />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='telefonoFamiliar' className='form-label'>
                                                        Telefono Familiar:
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='telefonoFamiliar' name='telefonoFamiliar' value={empleado?.telefonoFamiliar || ''} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='email' className='form-label'>
                                                        Email
                                                    </label>
                                                    <input onChange={onChangeInput} type='email' id='email' name='email' className='form-control' value={empleado?.email || ''} required />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='estadoCivil' className='form-label'>
                                                        EstadoCivil
                                                    </label>
                                                    {estadosCiviles ? (<Select3 options={estadosCiviles} valueKey="id" labelKey="descripcion" value={empleado?.estadoCivil} onChange={(e) => changeSelectFun(e, 'estadoCivil')} placeholder="Seleccione Estado"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='sexo' className='form-label'>
                                                        Sexo
                                                    </label>
                                                    <div className='input-group'>
                                                        <span style={{ margin: "5px" }} >
                                                            <input type="radio" id="m" name="sexo" value="M" checked={empleado?.sexo === "M"} onChange={onChangeInput} />
                                                            <label htmlFor="m" >&nbsp;MASCULINO</label>
                                                        </span>
                                                        <span style={{ margin: "5px" }}>
                                                            <input type="radio" id="f" name="sexo" value="F" checked={empleado?.sexo === "F"} onChange={onChangeInput} />
                                                            <label htmlFor="f" >&nbsp;FEMENINO</label>
                                                        </span>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>


                                        <div className='form-row'>
                                            <div className='col-md-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='observacion' className='form-label'>
                                                        Especifique si aqueja alguna enfermedad
                                                        (Hipertensión, Hipotensión, Diabetes, Alergia,
                                                        etc.)
                                                    </label>


                                                    <textarea onChange={onChangeTextarea} className='form-control' rows={5} id='observacion' name='observacion' value={empleado?.observacion || ''} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='btn-group mr-5'>
                                            <button type='submit' className='btn btn-secondary'>  Enviar  </button>
                                            <button type='button' className='btn btn-danger' onClick={() => setEmpleado(FUNCIONARIOINICIAL)}>  Cancelar </button>
                                        </div>
                                    </form>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className={activeTab === 'tab2' ? 'tab-pane fade show active' : 'tab-pane fade'}  >
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-3 col-md-12' >
                                    <div className=' mt-6 mb-3 card-body d-flex justify-content-center'>
                                        <img src={''} id='img' alt='Imagen' style={style} />
                                    </div>
                                    <div className=' mt-6 mb-3 card-body d-flex justify-content-center'>
                                        <div className='caption'>
                                            <p>
                                                <input type='file' className='form-control' id='uploadedfile' file-model='myFile' placeholder=' ' />
                                            </p>
                                        </div>
                                    </div>
                                    <div className='form-row'>
                                        <div className='col-lg-6 col-md-12'>
                                            <div className='position-relative form-group'>
                                                <label htmlFor='activo' className='form-label'>
                                                    Activo:
                                                </label>
                                                <div className='input-group'>
                                                    <span style={{ margin: "5px" }} >
                                                        <input type="radio" id="S" name="activo" value="S" checked={empleado?.activo === "S"} onChange={onChangeInput} />
                                                        <label htmlFor="S" >&nbsp;SI</label>
                                                    </span>
                                                    <span style={{ margin: "5px" }}>
                                                        <input type="radio" id="N" name="activo" value="N" checked={empleado?.activo === "N"} onChange={onChangeInput} />
                                                        <label htmlFor="N" >&nbsp;NO</label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-12'>
                                            <div className='position-relative form-group'>
                                                <label htmlFor='controlarHorario' className='form-label'>
                                                    Controlar Horario
                                                </label>
                                                <div className='input-group'>
                                                    <span style={{ margin: "5px" }} >
                                                        <input type="radio" id="S" name="controlarHorario" value="S" checked={empleado?.controlarHorario === "S"} onChange={onChangeInput} />
                                                        <label htmlFor="S" >&nbsp;SI</label>
                                                    </span>
                                                    <span style={{ margin: "5px" }}>
                                                        <input type="radio" id="N" name="controlarHorario" value="N" checked={empleado?.controlarHorario === "N"} onChange={onChangeInput} />
                                                        <label htmlFor="N" >&nbsp;NO</label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-12'>
                                            <div className='position-relative form-group'>
                                                <label htmlFor='bonificacion' className='form-label'>
                                                    Bonificación:
                                                </label>
                                                <div className='input-group'>
                                                    <span style={{ margin: "5px" }} >
                                                        <input type="radio" id="S" name="bonificacion" value="S" checked={empleado?.bonificacion === "S"} onChange={onChangeInput} />
                                                        <label htmlFor="S" >&nbsp;SI</label>
                                                    </span>
                                                    <span style={{ margin: "5px" }}>
                                                        <input type="radio" id="N" name="bonificacion" value="N" checked={empleado?.bonificacion === "N"} onChange={onChangeInput} />
                                                        <label htmlFor="N" >&nbsp;NO</label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-md-12'>
                                            <div className='position-relative form-group'>
                                                <label htmlFor='tipoIps' className='form-label'>
                                                    Grupo IPS
                                                </label>
                                                <div className='input-group'>
                                                    <span style={{ margin: "5px" }} >
                                                        <input type="radio" id="MENSUAL" name="tipoIps" value="MENSUAL" checked={empleado?.tipoIps === "MENSUAL"} onChange={onChangeInput} />
                                                        <label htmlFor="MENSUAL" >&nbsp;MENSUAL</label>
                                                    </span>
                                                    <span style={{ margin: "5px" }}>
                                                        <input type="radio" id="JORNAL" name="tipoIps" value="JORNAL" checked={empleado?.tipoIps === "JORNAL"} onChange={onChangeInput} />
                                                        <label htmlFor="JORNAL" >&nbsp;JORNAL</label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-9 col-md-12'>
                                    <form onSubmit={enviarForm} >
                                        <div className='form-row'>

                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='seleccion' className='form-label'>
                                                        Metodo de Seleccion:
                                                    </label>
                                                    {selecciones ? (<Select3 options={selecciones} valueKey="id" labelKey="descripcion" value={empleado?.seleccion} onChange={(e) => changeSelectFun(e, 'seleccion')} placeholder="Seleccione selección"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='categoria' className='form-label'>
                                                        Cargo:
                                                    </label>
                                                    {categorias ? (<Select3 options={categorias} valueKey="id" labelKey="descripcion" value={empleado?.categoria} onChange={(e) => changeSelectFun(e, 'categoria')} placeholder="Seleccione cargo"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='centroCosto' className='form-label'>
                                                        Centro costo:
                                                    </label>
                                                    {centroscostos ? (
                                                        <Select3
                                                            options={centroscostos}
                                                            valueKey="codigo"
                                                            labelKey="concat"
                                                            value={centroscostos.find((option) => option.codigo === empleado?.centroCostoCodigo)}
                                                            onChange={(e) => changeSelectFun(e, 'centroCosto')}
                                                            placeholder="Seleccione CentroCosto"
                                                        />
                                                    ) : <div>Cargando...</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='sucursal' className='form-label'>
                                                        Sucursal
                                                    </label>
                                                    {sucursales ? (<Select3 options={sucursales} valueKey="id" labelKey="descripcion" value={empleado?.sucursal} onChange={(e) => changeSelectFun(e, 'sucursal')} placeholder="Seleccione sucursal"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='sector' className='form-label'>
                                                        Sector:
                                                    </label>
                                                    {sectores ? (<Select3 options={sectores} valueKey="id" labelKey="descripcion" value={empleado?.sector} onChange={(e) => changeSelectFun(e, 'sector')} placeholder="Seleccione sector"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='subSector' className='form-label'>
                                                        Sub sector:
                                                    </label>
                                                    {subSectores ? (<Select3 options={subSectores} valueKey="id" labelKey="descripcion" value={empleado?.subSector} onChange={(e) => changeSelectFun(e, 'subSector')} placeholder="Seleccione sub sector"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>


                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='turno' className='form-label'>
                                                        Turno:
                                                    </label>
                                                    {turnos ? (<Select3 options={turnos} valueKey="id" labelKey="descripcion" value={empleado?.turno} onChange={(e) => changeSelectFun(e, 'turno')} placeholder="Seleccione Turno"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='horario' className='form-label'>
                                                        Horario:
                                                    </label>
                                                    {horarios ? (<Select3 options={horarios} valueKey="id" labelKey="concat" value={empleado?.horario} onChange={(e) => changeSelectFun(e, 'horario')} placeholder="Seleccione Horario"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='corporativo' className='form-label'>
                                                        Nro Corporativo:
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='corporativo' name='corporativo' value={empleado?.corporativo || ''} />
                                                </div>
                                            </div>
                                        </div>


                                        <div className='form-row'>

                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='fechaIngreso' className='form-label'>
                                                        Fecha Ingreso:
                                                    </label>
                                                    <input onChange={onChangeInput} type='date' className='form-control' id='fechaIngreso' name='fechaIngreso' value={empleado?.fechaIngreso || ''} required />

                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='fechaSalida' className='form-label'>
                                                        Fecha Salida:
                                                    </label>
                                                    <input onChange={onChangeInput} type='date' className='form-control' id='fechaSalida' name='fechaSalida' value={empleado?.fechaSalida || ''} />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='ctaBanco' className='form-label'>
                                                        Nro cuenta Banco:
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='ctaBanco' name='ctaBanco' value={empleado?.ctaBanco || ''} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='ingresoIps' className='form-label'>
                                                        Ingreso Ips:
                                                    </label>
                                                    <input onChange={onChangeInput} type='date' className='form-control' id='ingresoIps' name='ingresoIps' value={empleado?.ingresoIps || ''} required />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='salidaIps' className='form-label'>
                                                        Ingreso Salida:
                                                    </label>
                                                    <input onChange={onChangeInput} type='date' className='form-control' id='salidaIps' name='salidaIps' value={empleado?.salidaIps || ''} />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='interno' className='form-label'>
                                                        Nro Interno:
                                                    </label>
                                                    <input onChange={onChangeInput} type='text' className='form-control' id='interno' name='interno' value={empleado?.interno || ''} />
                                                </div>
                                            </div>

                                        </div>


                                        <div className='form-row'>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='frecuenciaPago' className='form-label'>
                                                        Frecuencia Pago:
                                                    </label>
                                                    {frecuenciasPago ? (<Select3 options={frecuenciasPago} valueKey="id" labelKey="descripcion" value={empleado?.frecuenciaPago} onChange={(e) => changeSelectFun(e, 'frecuenciaPago')} placeholder="Seleccione frecuencia de pago"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='tipoEmpleado' className='form-label'>
                                                        Tipo Empleado:
                                                    </label>
                                                    {tiposEmpleado ? (<Select3 options={tiposEmpleado} valueKey="id" labelKey="descripcion" value={empleado?.tipoEmpleado} onChange={(e) => changeSelectFun(e, 'tipoEmpleado')} placeholder="Seleccione frecuencia de pago"
                                                    />) : (<div>Cargando...</div>)}
                                                </div>
                                            </div>

                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='porcentajeIps' className='form-label'>
                                                        Porcentaje Ips:
                                                    </label>
                                                    <Select3 options={porcentajesIps} valueKey="id" labelKey="descripcion" value={empleado?.porcentajeIps} onChange={(e) => changeSelectFun(e, 'porcentajeIps')} placeholder="Seleccione % ipse" />
                                                </div>
                                            </div>

                                        </div>

                                        <div className='form-row'>

                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='ipsBase' className='form-label'>
                                                        Monto Ips Base:
                                                    </label>
                                                    <input onChange={onChangeInput} type='number' className='form-control' id='ipsBase' name='ipsBase' value={empleado?.ipsBase || ''} />
                                                </div>
                                            </div>
                                            <div className='col-md-4 col-sm-12'>
                                                <div className='position-relative form-group'>
                                                    <label htmlFor='anticipo' className='form-label'>
                                                        Monto Anticipo Mensual:
                                                    </label>
                                                    <input onChange={onChangeInput} type='number' className='form-control' id='anticipo' name='anticipo' value={empleado?.anticipo || ''} />
                                                </div>
                                            </div>
                                        </div>

                                          <div className='form-row'>
                                            {(globalData?.user.rol === 'Informatica' || globalData?.user.rol === 'Directores') ?

                                                <div className='col-md-4 col-sm-12'>
                                                    <div className="position-relative form-group"><label  >Salario Base</label>
                                                        <div className="input-group mb-3">
                                                            <button className="input-group-text " type='button' id="basic-addon1" onClick={OpenModalSalario}>Agregar Salario</button>
                                                            <input onChange={onChangeInput} disabled={true} className='form-control' id='salarioActual' name='salarioActual' value={empleado?.salarioActual.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true, currency: 'PYG', style: 'currency', currencyDisplay: 'symbol' }) || 0} required />
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                            }
                                            {(globalData?.user.rol === 'Informatica' || globalData?.user.rol === 'Directores') ?

                                                <div className='col-md-4 col-sm-12'>

                                                    <div className="position-relative form-group">
                                                        <label  >Honorarios profesionales</label>
                                                        <div className="input-group mb-3">
                                                            <button type="button" className="input-group-text" onClick={OpenModalHonorario}>Agregar Honorario</button>
                                                            <input onChange={onChangeInput} disabled={true} className='form-control' id='honorarioActual' name='honorarioActual' value={honorarioActual.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true, currency: 'PYG', style: 'currency', currencyDisplay: 'symbol' }) || 0} required />
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                            }
                                        </div>  

                                        <div className='btn-group mr-5'>
                                            <button type='submit' className='btn btn-secondary'>  Enviar  </button>
                                            <button type='button' className='btn btn-danger' onClick={() => setEmpleado(FUNCIONARIOINICIAL)}>  Cancelar </button>
                                        </div>
                                    </form>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className={activeTab === 'tab3' ? 'tab-pane fade show active' : 'tab-pane fade'} >
                        <div className='card-body'>
                            <form onSubmit={enviarForm} >
                                <div className='row'>
                                    <div className='col-md-4 col-sm-12'>
                                        <div className="position-relative form-group"><label  >Cantidad hijos</label>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <button type="button" className=" btn btn-secondary"> Modificar datos</button>
                                                </div>
                                                <input onChange={onChangeInput} className="form-control" value={personasHijos}
                                                    type="text" id='cantHijos' name='cantHijos'
                                                    disabled={true} ui-number-mask="0" />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-4 col-sm-12'>
                                        <div className="position-relative form-group"><label  >Otros familiares</label>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <button type="button" className=" btn btn-secondary"> Modificar datos</button>
                                                </div>
                                                <input onChange={onChangeInput} className="form-control"
                                                    type="text" id='cantHijos' name='cantHijos' value={empleadoFamilia}
                                                    disabled={true} ui-number-mask="0" />

                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-md-4 col-sm-12'>
                                        <div className='position-relative form-group'>
                                            <label htmlFor='familiaresEmpresa' className='form-label'>
                                                Familiar en empresa ?                                                   </label>
                                            <div className='input-group'>
                                                <span style={{ margin: "5px" }} >
                                                    <input type="radio" id="S" name="familiaresEmpresa" value="S" checked={empleado?.familiaresEmpresa === "S"} onChange={onChangeInput} />
                                                    <label htmlFor="S" >&nbsp;SI</label>
                                                </span>
                                                <span style={{ margin: "5px" }}>
                                                    <input type="radio" id="N" name="familiaresEmpresa" value="N" checked={empleado?.familiaresEmpresa === "N"} onChange={onChangeInput} />
                                                    <label htmlFor="N" >&nbsp;NO</label>
                                                </span>
                                            </div>

                                        </div>
                                    </div>


                                </div>


                                <div className='btn-group mr-5'>
                                    <button type='submit' className='btn btn-secondary'>  Enviar  </button>
                                    <button type='button' className='btn btn-danger' onClick={() => setEmpleado(FUNCIONARIOINICIAL)}>  Cancelar </button>
                                </div>
                            </form>


                        </div>
                    </div>
                    <div className={activeTab === 'tab4' ? 'tab-pane fade show active' : 'tab-pane fade'}     >
                        <div className='card-body'>
                            <form onSubmit={enviarForm} >
                                <div className="row show-grid">
                                    <div className="form-group">
                                        <label className="col-md-2 control-label">Grado académico </label>
                                        <div className="col-md-3">
                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0"
                                                        checked={empleado?.escolarCompleta} id="escolarCompleta"
                                                        name="escolarCompleta" />
                                                    <span>Educación Escolar Básica (Completa)</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0"
                                                        id="mediaCompleta"
                                                        name="mediaCompleta" checked={empleado?.mediaCompleta} />
                                                    <span>Educación Media (Completa)</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0"
                                                        id="tecnicaturaCompleta"
                                                        name="tecnicaturaCompleta" checked={empleado?.tecnicaturaCompleta}
                                                    />
                                                    <span>Técnicatura (Especificar Área-Completa)</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0"
                                                        id="universitarioCompleto"
                                                        name="universitarioCompleto" checked={empleado?.universitarioCompleto}
                                                    />
                                                    <span>Nivel Universitario(Completo)</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">

                                            <div className="checkbox">
                                                <label>
                                                    <input id="escolarIncompleta"
                                                        name="escolarIncompleta" onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0"
                                                        checked={empleado?.escolarIncompleta} />
                                                    <span>Educación Escolar Básica (Incompleta)</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0" id="mediaIncompleta" name="mediaIncompleta" checked={empleado?.mediaIncompleta} />
                                                    <span>Educación Media (Incompleta)</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0" id="tecnicaturaIncompleta" name="tecnicaturaIncompleta" checked={empleado?.tecnicaturaIncompleta}
                                                    />
                                                    <span>Técnicatura (Incompleta)</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox} type="checkbox" className="checkbox style-0" id="universitarioIncompleto" name="universitarioIncompleto" checked={empleado?.universitarioIncompleto} />
                                                    <span>Nivel Universitario(Incompleto)</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7">
                                        <div className="form-group">
                                            <label>Carrera</label>
                                            {carreras ? (<Select3 options={carreras} valueKey="id" labelKey="descripcion" value={empleado?.carrera} onChange={(e) => changeSelectFun(e, 'carrera')} placeholder="Seleccione carrera" />) : (<div>Cargando...</div>)}
                                        </div>
                                    </div>

                                    <div className="col-lg-7">
                                        <div className="form-group">
                                            <label>Especifique si se encuentra cursando actualmente
                                                otros estudios</label>
                                            <textarea onChange={onChangeTextarea} className='form-control' rows={5} id='estudios' name='estudios' value={empleado?.estudios || ''} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="col-md-2 control-label">Post Graduación </label>
                                        <div className="col-md-3">

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox}
                                                        type="checkbox" className="checkbox style-0" id="especializacion"
                                                        name="especializacion"
                                                        checked={empleado?.especializacion}
                                                    />
                                                    <span>Especialización</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox}
                                                        type="checkbox" className="checkbox style-0"
                                                        checked={empleado?.maestria} id="maestria"
                                                        name="maestria"
                                                    />
                                                    <span>Maestría</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={onChangeCheckbox}
                                                        type="checkbox" className="checkbox style-0"
                                                        checked={empleado?.doctorado} id="doctorado"
                                                        name="doctorado" />
                                                    <span>Doctorado</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-7">
                                        <div className="form-group">
                                            <label>Descripcion del Post Grado</label>
                                            <input onChange={onChangeInput} type="text" name="postgrado"
                                                value={empleado?.postgrado || ''}
                                                className="form-control"
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>


                </div>

                <ModalData title="Salario" show={showModalSalario} onClose={CloseModalSalario} size="lg">
                    <form id="formSalario" name="formSalario" role="form" onSubmit={guardarSalario}>
                        <div className="modal-body">
                            <div className="form-group">
                                <button className="btn btn-secondary" type="button" onClick={() => setInsertSalario(true)}>Nuevo Salario</button>
                            </div>

                            <table className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Observacion</th>
                                        <th>Estado</th>
                                        <th  ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(empleado?.salariosDetalle) ?
                                        empleado?.salariosDetalle.map(item =>
                                            <tr key={(item.id) ? item.id + item.monto : item.monto}>
                                                <td>{new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                <td>{item.monto.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true, currency: 'PYG', style: 'currency', currencyDisplay: 'symbol' })}</td>
                                                <td>{item.observacion}</td>
                                                {(item.activo == 'S' ? <td>ACTIVO</td> : <td>INACTIVO</td>)}
                                                <td>
                                                    <button type="button" onClick={() => removeSalario(item)} className="btn btn-danger" title="Eliminar">
                                                        <BsFillTrash3Fill />
                                                    </button>
                                                </td>
                                            </tr>)
                                        : null
                                    }
                                </tbody>
                            </table>

                            {
                                (insertSalario) ?
                                    <fieldset >
                                        <legend>Complete la información del salario</legend>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <label>Fecha</label>
                                                    <input type="date" id='fecha' name='fecha' className="form-control" onChange={onChangeSalarioAdd} value={salarioAdd?.fecha || ''} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Monto</label>
                                                    <input type="text" id='monto' name='monto' className="form-control" onChange={onChangeSalarioAdd} value={salarioAdd?.monto || ''} min="0" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Observación</label>
                                                    <input type="text" id='observacion' name='observacion' className="form-control" onChange={onChangeSalarioAdd} value={salarioAdd?.observacion || ''} min="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset> : null
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-secondary"  > {(empleado?.id) ? 'Guardar' : 'Aceptar'}                            </button>
                            <button type="button" className="btn btn-secondary" onClick={CloseModalSalario}>Cancelar</button>

                        </div>
                    </form>
                </ModalData>
                <ModalData title="Honorario" show={showModalHonorario} onClose={CloseModalHonorario} size="lg">
                    <form id="formHonorario" name="formHonorario" role="form" onSubmit={guardarHonorario}>
                        <div className="modal-body">
                            <div className="form-group">
                                <button className="btn btn-secondary" type="button" onClick={() => setInsertHonorario(true)}>Nuevo Honorario</button>
                            </div>

                            <table className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Observacion</th>
                                        <th>Estado</th>
                                        <th  ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(empleado?.honorariosProfesionales) ?
                                        empleado?.honorariosProfesionales.map(item =>
                                            <tr key={(item.id) ? item.id + item.monto : item.monto}>
                                                <td>{new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                <td>{item.monto.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true, currency: 'PYG', style: 'currency', currencyDisplay: 'symbol' })}</td>
                                                <td>{item.observacion}</td>
                                                {(item.activo == 'S' ? <td>ACTIVO</td> : <td>INACTIVO</td>)}
                                                <td>
                                                    <button type="button" onClick={() => removeHonorario(item)} className="btn btn-danger" title="Eliminar">
                                                        <BsFillTrash3Fill />
                                                    </button>
                                                </td>
                                            </tr>)
                                        : null
                                    }
                                </tbody>
                            </table>

                            {
                                (insertHonorario) ?
                                    <fieldset >
                                        <legend>Complete la información del honorario</legend>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <label>Fecha</label>
                                                    <input type="date" id='fecha' name='fecha' className="form-control" onChange={onChangeHonrarioAdd} value={honorarioAdd?.fecha || ''} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Monto</label>
                                                    <input type="text" id='monto' name='monto' className="form-control" onChange={onChangeHonrarioAdd} value={honorarioAdd?.monto || ''} min="0" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Observación</label>
                                                    <input type="text" id='observacion' name='observacion' className="form-control" onChange={onChangeHonrarioAdd} value={honorarioAdd?.observacion || ''} min="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset> : null
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-secondary"  > {(empleado?.id) ? 'Guardar' : 'Aceptar'}  </button>
                            <button type="button" className="btn btn-secondary" onClick={CloseModalHonorario}>Cancelar</button>

                        </div>
                    </form>
                </ModalData>
            </div>
        </>

    );
};
export default Empleados; 
