"use client";
// @ts-nocheck
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import Logo from '../../public/assets/img/logo.png'
import { Lobster, Secular_One, Roboto } from "next/font/google";
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import { useHotkeys } from 'react-hotkeys-hook';
import { Dialog, Transition } from '@headlessui/react';
import io from "socket.io-client";

const socket = io("http://localhost:8000");


const seculerOne = Secular_One({ subsets: ['latin'], weight: ["400"] })
const roboto = Roboto({ subsets: ['latin'], weight: ["400"] })
const lobster = Lobster({ subsets: ['latin'], weight: ["400"] })
interface IData {
    name: string;
    price: number;
    qty: number;
    total: number;
}
function PageHome() {
    const [data, setdata] = useState<IData[]>([])
    const [date, setDate] = useState('');
    const printRef = useRef(null);
    const { register, reset, handleSubmit, watch, setFocus, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    let [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("");
    const [getData, setGetData] = useState(false)
    const [panjang, setPanjang] = useState(1)
    const [lebar, setLebar] = useState(1)
    const [qty, setQty] = useState(1)
    const [total, setTotal] = useState(0)
    const [harga, setHarga] = useState(0)
    const [qr, setQr] = useState("")
    const [nameProduct, setNameProduct] = useState('')
    const [customer, setCustomer] = useState({
        name:'',
        noTlp:null
    })
    const [nameCustomer, setNameCustomer] = useState('')
    const [toCustomer, setToCustomer] = useState('')


    const panjangOnchage = () => {
        console.log(panjang);
    }
    const lebarOnchage = () => {
        console.log(lebar);
    }



    useEffect(() => {
        // menangani event "message" dari server
        socket.on("message", (data) => {
          setMessage(data);
        });

        socket.on("qr", (data) => {
            console.log('qr received', data);
            setGetData(false)
            setQr(data);
          });

        // menangani event "connect" dari server
        socket.on("connect", () => {
          console.log("Terhubung ke server WebSocket");
        });

        socket.on("ready", () => {
            setQr('')
            setGetData(false)
          });

        // menangani event "disconnect" dari server
        socket.on("disconnect", () => {
          console.log("Terputus dari server WebSocket");
        });

        // membersihkan event listener saat komponen unmount
        return () => {
          socket.off("message");
          socket.off("connect");
          socket.off("disconnect");
        };
      }, []);

      const calculateTotal = (qty: number, price: number) => {
        return qty * price;
    }

    useHotkeys('f1', (event) => {
        event.preventDefault(); // Mencegah default browser shortcut F1
        // handleF1();
        openModal()
    });
    const handleQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const qty = Number(value);
        const price = Number(watch('price'));
        const total = calculateTotal(qty, price);
        setValue('total', total);
    }

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const price = Number(value);
        const qty = Number(watch('qty'));
        const total = calculateTotal(qty, price);
        setValue('total', total);
    }


    const capture = useCallback(() => {
        if (printRef.current === null) {
            return
        }

        toPng(printRef.current, { cacheBust: true, })
            .then(async (dataUrl) => {
                console.log(dataUrl);

                console.log({
                    name:customer.name,
                    no:toCustomer,
                    grandTotal: grandTotal
                });


                setLoading(true)
                const sent = await sendNota(dataUrl)
                // if (sent) {
                    setLoading(false)
                // }
                // console.log(dataUrl);
                // const link = document.createElement('a')
                // link.download = 'my-image-name.png'
                // link.href = dataUrl
                // link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [printRef])

    useEffect(()=>{
        console.log((panjang*lebar)*qty*harga);
        setTotal((panjang*lebar)*qty*harga)


    },[panjang, lebar, qty, harga])

    useEffect(()=>{
        if (nameProduct === 'banner') {
            setHarga(27000)
        }
    },[nameProduct])


    const sendNota = async (base64: string) => {
        const res = await fetch(`http://localhost:8000/send-nota`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: '087833372003',
                base64
            })
        })
        if (!res.ok) throw new Error('failed to fetch')

        const data = await res.json()

        console.log(data);
        return data

    }

    const grandTotal = data.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.total), 0);



       const sendMessage = () => {
        // mengirim pesan ke server
        socket.emit("message", "Ini adalah pesan dari client");
      };


      if (getData){
        return(
            <div>Loading</div>
        )
      }

      if (qr) {
        return (
            <div className='flex w-full min-h-screen text-center justify-center'>
                <Image className='object-cover w-80 h-80' src={qr} alt='qrCode' width={400} height={400}/>
            </div>
        )
      }
    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const onSubmit = (formData: any) => {
        setdata([...data, { ...formData }]);
        reset()
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.focus();
        }
    };

    const submitData = () => {
        let product = nameProduct
        if(nameProduct === 'banner') {
            product = nameProduct + ' (' + panjang + 'x' + lebar + ')'

        }
        setdata([...data, { name: product, qty, total, price:harga }]);
        setIsOpen(false)
        setHarga(0)
                        setNameProduct('')
                        setQty(1)
                        setPanjang(1)
                        setLebar(1)
            // const nameInput = document.getElementById('name');
            // if (nameInput) {
            //     nameInput.focus();
            // }

    }

    // useEffect(() => {
    //     socketInitializer();
    //   }, []);

    //   const socketInitializer = async () => {
    //     // We just call it because we don't need anything else out of it
    //     await fetch("http://localhost:8000");

    //     socket = io();
    //     socket.on("connection", (msg) => {
    //       console.log(msg);
    //     });
    //   };

    return (
        <div className='w-full p-20'>

            {/* <div className='mt-6 max-w-4xl mx-auto'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                    <div className="grid grid-cols-12 gap-4">
                        <div className='flex flex-col col-span-3'>
                            <label htmlFor="name">Name</label>
                            <input className='appearance-none ' {...register("name")} type="text" name='name' id='name' placeholder='Name' />
                        </div>
                        <div className='flex flex-col col-span-3'>
                            <label htmlFor="qty">QTY</label>
                            <input defaultValue={1} className='appearance-none ' {...register("qty")} type="number" name='qty' id='qty' placeholder='QTY' onChange={handleQtyChange} />
                        </div>
                        <div className='flex flex-col col-span-3'>
                            <label htmlFor="price">HARGA</label>
                            <input className='appearance-none ' {...register("price")} type="number" name='price' id='price' placeholder='HARGA' onChange={handlePriceChange} />
                        </div>
                        <div className='flex flex-col col-span-3'>
                            <label htmlFor="total">TOTAL</label>
                            <input className='appearance-none ' {...register("total")} type="number" name='total' id='total' placeholder='TOTAL' />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type='submit' className='mr-8 border rounded-md px-4 py-1.5 bg-blue-700 text-white'>Submit</button>
                    </div>
                </form>
            </div> */}
            <div className="mt-6 max-w-4xl mx-auto flex items-center justify-between">
                <button onClick={openModal} className='mr-8 border rounded-md px-4 py-1.5 bg-blue-700 text-white'>Add Data (F1)</button>
                <button  onClick={capture} className={`ml-8 border rounded-md px-4 py-1.5 text-white ${customer.noTlp ?'bg-blue-700':'cursor-not-allowed bg-blue-700'}`}>Kirim</button>

                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={()=>{
                        closeModal()
                        setHarga(0)
                        setNameProduct('')
                        setQty(1)
                        setPanjang(1)
                        setLebar(1)
                    }}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-[300px] justify-center p-4 pt-14 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-[400]"
                                    enterFrom="opacity-0 -translate-y-10"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="ease-in duration-[400]"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 -translate-y-10"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        {/* <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Payment successful
                                        </Dialog.Title> */}
                                        {!customer.noTlp && (


                                        <div className="mt-2 space-y-4">
                                            <div className='grid grid-cols-12 gap-4'>
                                                <label className='col-span-3' htmlFor="to">To</label>
                                                <input value={nameCustomer} onChange={(e:any)=> setNameCustomer(e.target.value)} className='col-span-9' type="text" id='to' name='to' placeholder='NAME'/>
                                            </div>

                                            <div className='grid grid-cols-12 gap-4'>
                                                <label className='col-span-3' htmlFor="noTlp">No Telp</label>
                                                <input value={toCustomer} onChange={(e:any)=> setToCustomer(e.target.value)} className='col-span-9' type="text" id='noTlp' name='noTlp' placeholder='628*** / 08***'/>
                                            </div>

                                            <div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={(e:any)=> {
                                                    setCustomer({name: nameCustomer, noTlp: toCustomer})
                                                    alert(JSON.stringify({name: nameCustomer, noTlp: toCustomer}))
                                                }}
                                            >
                                                submit
                                            </button>
                                            </div>
                                        </div>
                                        )}
{customer.noTlp && (
    <div>

<div className='space-y-4'>
                                            <div className='grid grid-cols-12 gap-4'>
                                                <label className='col-span-3' htmlFor="name">Name</label>
                                                <input className='col-span-9' type="text" onChange={(e:any)=>{
                                                    setNameProduct(e.target.value)

                                                }} value={nameProduct}/>
                                            </div>
                                            {nameProduct === 'banner' && (
                                                <div className='grid grid-cols-12 gap-4'>
                                                <label className='col-span-3' htmlFor="name">Panjang</label>
                                                <input className='col-span-3' type="text" value={panjang} onChange={(e:any)=>{setPanjang(e.target.value)}}/>
                                                <label className='col-span-3' htmlFor="name">Lebar</label>
                                                <input className='col-span-3' type="text" value={lebar} onChange={(e:any)=>{setLebar(e.target.value)}}/>
                                            </div>
                                            )}
                                            <div className='grid grid-cols-12 gap-4'>
                                                <label className='col-span-3' htmlFor="name">Qty</label>
                                                <input className='col-span-3' type="text" value={qty} onPointerCancel={()=>alert('cancel')} onChange={(e:any)=>{setQty(e.target.value)}}/>
                                                <label className='col-span-3' htmlFor="name">Harga</label>
                                                <input value={harga} onChange={(e:any)=>{setHarga(e.target.value)}} className='col-span-3' type="number" />
                                            </div>

                                            <div className='flex items-center justify-between'>
                                                <label>Total</label>
                                                <input  type="hidden" id='total' name='total' placeholder='0' value={total} onChange={(e:any)=>{setTotal(e.target.value)}} />
                                                <label className='font-bold w-40 border border-blue-600 text-right rounded pr-1.5 py-1'>{total ? total : '-'}</label>
                                            </div>
                                        </div>
<div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                // onClick={closeModal}
                                                // onClick={()=>{
                                                //     alert(JSON.stringify({qty, harga, total}))
                                                // }}
                                                onClick={submitData}
                                            >
                                                Save
                                            </button>
                                        </div>
    </div>



)}

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
            <div className={`max-w-4xl mt-6 mx-auto border ${roboto.className}`}>
                <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', width: '100%' }} id='print' className='mx-auto print p-6 min-h-[400px] flex flex-col' ref={printRef}>
                    <div className='w-full flex'>
                        <div className='w-[60%] text-red-500 py-1'>
                            <div className='flex items-center space-x-4 justify-center'>
                                <div><Image alt='logo' src={Logo} width={35} height={35} /></div>
                                <div className='text-center leading-4'>
                                    <h1 style={{ fontSize: '24px', fontWeight: '700' }} className={seculerOne.className}>REZA PUTRA</h1>
                                    <h3 style={{ fontSize: '13px' }} className={lobster.className}>Fotocopy & Digital Printing</h3>
                                </div>
                            </div>
                            <div className='text-center leading-4 mt-1 text-sm'>
                                <p>Cetak Banner, sticker,  Stempel, Undangan, ATK, dll</p>

                            </div>
                            <div className='text-center leading-4 mt-1 text-xs font-semibold'>
                                <p><i>JL. Raya Pasar Cerih, Jatinegara Tegal</i></p>
                                <p>HP: 0877-0042-1485</p>
                            </div>
                        </div>
                        <div className='w-[40%] flex justify-end text-left'>
                            <div className='w-[350px] text-red-500 leading-6'>
                                <table>
                                    <tr>
                                        <td className='w-[110px]'>No Nota</td>
                                        <td>:</td>
                                        <td>00001/RDGP/02/05</td>
                                    </tr>
                                    <tr>
                                        <td className='w-[110px]'>Tanggal</td>
                                        <td>:</td>
                                        <td>{date}</td>
                                    </tr>
                                    <tr>
                                        <td>To</td>
                                        <td>:</td>
                                        <td>{customer.name ? customer.name : '...............'}</td>
                                    </tr>
                                </table>

                            </div>
                        </div>
                    </div>
                    <table className='table-fixed w-full mt-4'>
                        <thead>
                            <tr>
                                <th style={{ paddingTop: '0.375rem !important', paddingBottom: '0.375rem !important' }} className='border w-8'>No</th>
                                <th style={{ paddingTop: '0.375rem !important', paddingBottom: '0.375rem !important' }} className='border w-80'>Nama</th>
                                <th style={{ paddingTop: '0.375rem !important', paddingBottom: '0.375rem !important' }} className='border w-32'>Harga</th>
                                <th style={{ paddingTop: '0.375rem !important', paddingBottom: '0.375rem !important' }} className='border w-20'>Jumlah</th>
                                <th style={{ paddingTop: '0.375rem !important', paddingBottom: '0.375rem !important' }} className='border'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data?.map((item: IData, index: number) => (
                                <tr key={index}>
                                    <td className='border text-center'>{index + 1}</td>
                                    <td className='border pl-4'>{item.name}</td>
                                    <td className='border text-right pr-4'>{parseInt(item.price).toLocaleString()}</td>
                                    <td className='border text-center'>{item.qty}</td>
                                    <td className='border text-right pr-4'>{parseInt(item.total).toLocaleString()}</td>
                                </tr>
                            ))}
                            {data.length > 0 && (
                                <tr>
                                    <td colSpan={4} className='border text-lg text-center font-bold'>Sub Total</td>
                                    <td className='border text-lg text-right pr-4 font-bold'>Rp. {grandTotal.toLocaleString()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='ml-auto mt-auto pt-4 w-52 h-24 text-center text-red-500'>
                        <p>Hormat Kami</p>
                        <p className='font-bold mt-8'>REZA PUTRA DGP</p>
                    </div>
                </div>
            </div>



            {loading && (
                <div className="loading absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center z-10">
                    <div className="flex items-center justify-center ">
                        <div className="w-16 h-16 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PageHome
