"use client";
// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import Logo from '../../public/assets/img/logo.png'
import { Lobster, Secular_One, Roboto } from "next/font/google";
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import { useHotkeys } from 'react-hotkeys-hook';
// import io from "socket.io-client";
// let socket;
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
    const { register, reset, handleSubmit, watch, setFocus,setValue, formState: { errors } } = useForm();

    const onSubmit = (formData: any) => {
        setdata([...data, { ...formData }]);
        reset()
        const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.focus();
    }
    };
    const grandTotal = data.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.total), 0);
    useEffect(() => {
        const subscription = watch((value, { name, type }) => console.log(value, name, type));
        return () => subscription.unsubscribe();
    }, [watch]);

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
    const calculateTotal = (qty: number, price: number) => {
        return qty * price;
    }

    useHotkeys('f1', (event) => {
        event.preventDefault(); // Mencegah default browser shortcut F1
        // handleF1();
        alert('F1 diteken')
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
                 sendNota(dataUrl)
                console.log(dataUrl);
                // const link = document.createElement('a')
                // link.download = 'my-image-name.png'
                // link.href = dataUrl
                // link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [printRef])

    useEffect(() => {
        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        const formattedDate = currentDate.toLocaleDateString('id-ID', options);
        setDate(formattedDate);
      }, []);
    const sendNota = async (base64: string) => {
        const res = await fetch(`http://localhost:8000/media`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                number: '6287833372003',
                base64
              })
        })
        if (!res.ok) throw new Error('failed to fetch')

        const data = await res.json()

        console.log(data);

    }
    return (
        <div className='w-full p-20'>

            <div className='mt-6'>
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
            </div>
            <div className={`max-w-4xl mx-auto border ${roboto.className}`}>
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
                                        <td>...............</td>
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

            <button onClick={capture} className='mr-8 border rounded-md px-4 py-1.5 bg-blue-700 text-white'>Kirim</button>


        </div>
    )
}

export default PageHome
