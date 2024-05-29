import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AppPDF } from '../AppPDF';

export const Estacionamiento = () => {
  const [showModalInfo, setShowModalInfo] = useState<boolean>(false);
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] =
    useState<boolean>(false);
  const [editarModal, setEditarModal] = useState<boolean>(true);
  const [placa, setPlaca] = useState('');
  const [residente, setResidente] = useState<string>('Oficial');
  const [datos, setDatos] = useState([]);
  const [vehiculo, setVehiculo] = useState<any>([]);
  const [valueEntrada, onChangeEntrada] = useState<any>(new Date());
  const [valueSalida, onChangeSalida] = useState<any>(new Date());
  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    try {
      const fetchData = async () => {
        await axios
          .get("https://estacionamiento-back.vercel.app/api/datos")
          .then((a) => {
            const { data } = a;
            setDatos(data);
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
          });
      };
      fetchData();
    } catch (e) {
      console.log('error en hacer fetch');
    }
  }, [datos]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const datos = { placa, residente };

    try {
      await axios
        .post("https://estacionamiento-back.vercel.app/api/datos", datos)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (id: string) => {
const entradaNumero = new Date(valueEntrada).getTime();
  const salidaNumero = new Date(valueSalida).getTime();
  const resultado = salidaNumero - entradaNumero;
	
 
    
    try {
		const datosAxios = {
		  entrada: valueEntrada,
		  salida: valueSalida,
		  cobro: 0,
		};
		 if (valueEntrada && valueSalida) {
       if (vehiculo.residente === "No residente") {
         const division = Math.round(resultado / 60000);
		     datosAxios.cobro = division * 3
			 
       }
       if (vehiculo.residente === "Residente") {
         datosAxios.cobro = Math.round(resultado / 60000);
       }
     }
	
      await axios
        .patch(
          `https://estacionamiento-back.vercel.app/api/datos/${id}`,
          datosAxios
        )
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        });
    } catch (error) {
      console.log('necesitas llenar los campos');
    }
  };

  useEffect(() => {
    if (vehiculo) {
      setPlaca(vehiculo.placa);
    }
  }, [vehiculo]);


  const eliminarModal = async (id: string) => {
    await axios.delete(
      `https://estacionamiento-back.vercel.app/api/datos/${id}`
    );
    window.location.reload();
  };

  const editarVehiculo = async () => {
    setEditarModal(!editarModal);
  };

  const mostrarDatos = (a: any) => {
    setVehiculo(a);
    setShowModalInfo(!showModalInfo);
  };

  const cambioDeMinutosAHora = (totalMinutos: number) => {
    const minutos = totalMinutos % 60;
    const horas = Math.floor(totalMinutos / 60);

    return `${separar(horas)}:${separar(minutos)}`;
  };

  const separar = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="h-full w-full">
      {datos ? (
        <>
          <div className="flex mt-4 justify-end px-4">
            <button
              className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-teal-700 hover:bg-teal"
              onClick={() => setShowModalAdd(true)}
            >
              Ingresar nuevo vehiculo
            </button>
          </div>

          <div className=" flex items-center justify-center bg-teal-lightest font-sans py-10">
            <div className="bg-white rounded shadow p-6 w-full lg:max-w-4xl">
              <div className="mb-4 ">
                <h1 className="text-grey-darkest text-4xl text-center">
                  Estacionamiento
                </h1>
              </div>
              <div>
                <div className="flex mb-4 justify-between text-2xl">
                  <p>Placa</p>
                  <p>Tipo de vehiculo</p>
                  <p>Tiempo en estacionamiento</p>
                  <p>Cobro</p>
                </div>

                {datos.map((vehiculo: any, i) => (
                  <div id={vehiculo._id} key={i}>
                    <div className="flex mb-4 justify-between">
                      <div>
                        <button
                          className=" bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-md p-2 rounded truncate"
                          type="button"
                          onClick={() => mostrarDatos(vehiculo)}
                        >
                          {vehiculo.placa}
                        </button>
                      </div>
                      <div className="flex w-[150px]">
                        <p>{vehiculo.residente}</p>
                      </div>

                      {vehiculo.residente === 'No residente' ||
                      vehiculo.residente === 'Oficial' ? (
                        <div className="flex justify-between w-[150px]">
                          <p>
                            {vehiculo.cobro.slice(-1) >= 60
                              ? cambioDeMinutosAHora(
                                  vehiculo.cobro.slice(-1) / 3
                                ) + ' Horas'
                              : vehiculo.cobro.slice(-1) / 3 + ' minutos'}
                          </p>
                        </div>
                      ) : (
                        <div className="flex justify-between w-[150px]">
                          <p>
                            {vehiculo.cobro.slice(-1) >= 60
                              ? cambioDeMinutosAHora(vehiculo.cobro.slice(-1)) +
                                ' Horas'
                              : vehiculo.cobro.slice(-1) + ' minutos'}
                          </p>
                        </div>
                      )}
                      {vehiculo.residente === 'Oficial' ? (
                        <div className="">
                          <p>No hay cobro</p>
                        </div>
                      ) : (
                        <div className="">
                          <p>${vehiculo.cobro.slice(-1)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mr-20">
            <PDFDownloadLink
              document={<AppPDF data={datos} />}
              fileName={'estacionamiento'}
            >
              {({ loading }) =>
                loading ? (
                  'Cargando...'
                ) : (
                  <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-lg p-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150">
                    Descargar Pdf
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>
          <div>
            {showModalInfo ? (
              <>
                <div className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-full my-6 mx-auto max-w-3xl ">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between  p-5 border-b border-solid border-slate-200 rounded-t">
                        <input
                          className="text-5xl font-semibold w-full "
                          disabled={editarModal}
                          defaultValue={'Placa: ' + vehiculo.placa}
                          onChange={(e) => setPlaca(e.target.value)}
                          required
                        />

                        <div>
                          <button
                            className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => setShowModalInfo(false)}
                          >
                            <span className="bg-transparent text-black  h-6 w-6 text-4xl block outline-none focus:outline-none">
                              ×
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="relative p-6 flex-auto">
                        <div>
                          <p className="my-4 text-slate-500 text-lg leading-relaxed">
                            Placa: {vehiculo.placa}
                          </p>
                          <div className="flex justify-around">
                            <label className="block mt-3 mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                              Escoge la hora de entrada
                            </label>
                            <label className="block mt-3 mb-1 text-sm font-medium text-gray-900 dark:text-gray-400">
                              Escoge la hora de salida
                            </label>
                          </div>
                          <div className="flex justify-around">
                            <DateTimePicker
                              onChange={onChangeEntrada}
                              value={valueEntrada}
                              disabled={editarModal}
                            />
                            <DateTimePicker
                              onChange={onChangeSalida}
                              value={valueSalida}
                              disabled={editarModal}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        {editarModal ? (
                          <>
                            <button
                              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() =>
                                setShowModalConfirmDelete(
                                  !showModalConfirmDelete
                                )
                              }
                            >
                              Eliminar
                            </button>
                            <button
                              className="bg-sky-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => editarVehiculo()}
                            >
                              Editar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => setEditarModal(!editarModal)}
                            >
                              Cancelar
                            </button>
                            <button
                              className="bg-emerald-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="submit"
                              onClick={() => {
                                handleSave(vehiculo._id);
                                setEditarModal(!editarModal);
                                setShowModalInfo(!showModalInfo);
                              }}
                            >
                              Guardar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                <div>
                  {showModalConfirmDelete ? (
                    <div className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="relative w-full my-6 mx-auto max-w-3xl ">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                          <div className="flex items-start justify-between  p-5 border-b border-solid border-slate-200 rounded-t">
                            <h1 className="text-5xl font-semibold w-full ">
                              Estas seguro que quieres eliminar el vehiculo{' '}
                              {vehiculo.placa}?
                            </h1>
                          </div>
                          <div className="flex justify-around py-4">
                            <button
                              className="text-blue-800 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => setShowModalConfirmDelete(false)}
                            >
                              Cerrar
                            </button>
                            <button
                              className="bg-red-600 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => eliminarModal(vehiculo._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
          <div>
            {showModalAdd ? (
              <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                          <h3 className="text-3xl font-semibold">
                            Agrega un nuevo vehiculo
                          </h3>
                          <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => setShowModalAdd(false)}
                          >
                            <span className=" text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                              X
                            </span>
                          </button>
                        </div>
                        <div className="relative p-6 flex-auto">
                          <input
                            id="placa"
                            name="placa"
                            className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker mb-4"
                            placeholder="Numero de placa"
                            onChange={(e) => setPlaca(e.target.value)}
                          />
                          <select
                            id="residente"
                            name="residente"
                            onChange={(e) => setResidente(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-300 dark:placeholder-gray-400 dark:text-stone-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option defaultValue={'Oficial'}>
                              Selecciona una opcion del tipo de vehiculo
                            </option>
                            <option value="Oficial">Oficial</option>
                            <option value="Residente">Residente</option>
                            <option value="No residente">No residente</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                          <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setShowModalAdd(false)}
                          >
                            Cerrar
                          </button>
                          <button
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="submit"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </form>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Estacionamiento;
