"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import Logo from '../../public/assets/img/logo.png'
import { Lobster, Secular_One, Roboto } from "next/font/google";
import Image from 'next/image';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

const seculerOne = Secular_One({subsets:['latin'], weight:["400"]})
const roboto = Roboto({subsets:['latin'], weight:["400"]})
const lobster = Lobster({subsets:['latin'], weight:["400"]})
interface IData {
    name: string;
    price: number;
    qty: number;
    total: number;
}
function page() {
    const [data, setdata] = useState<IData[]>([])
    const printRef = useRef(null);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [qty, setQty] = useState(0)
    const [price, setPrice] = useState(0)
    const watchShowAge = watch("price", false);
    const onSubmit = (formData: any) => {
        setdata([...data, { ...formData }]);
        console.log(data);
        console.log(watch());
    };
    const grandTotal = data.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.total), 0);
    useEffect(() => {
        const subscription = watch((value, { name, type }) => console.log(value, name, type));
        return () => subscription.unsubscribe();
    }, [watch]);

    const calculateTotal = (qty: number, price: number) => {
        return qty * price;
    }

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

//   function capture() {
//     const printClass = printRef.current;
//     html2canvas(printClass, {
//       scale: 2,
//       scrollX: -window.scrollX,
//       scrollY: -window.scrollY
//     }).then(canvas => {
//       const dataUrl = canvas.toDataURL();
//       console.log(dataUrl);
//     });
//   }

const capture = useCallback(() => {
    if (printRef.current === null) {
      return
    }

    toPng(printRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        console.log(dataUrl);

        const link = document.createElement('a')
        link.download = 'my-image-name.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [printRef])
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
                            <input className='appearance-none ' {...register("qty")} type="number" name='qty' id='qty' placeholder='QTY' onChange={handleQtyChange} />
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
            <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', width: '100%'}} id='print' className='mx-auto print p-6 h-[500px]' ref={printRef}>
                <div className='w-full flex'>
                    <div className='w-[50%] text-red-500 py-1'>
                        <div className='flex items-center space-x-4 justify-center'>
                            <div><Image alt='logo' src={Logo} width={35} height={35}/></div>
                            <div className='text-center leading-4'>
                                <h1 style={{ fontSize:'24px', fontWeight:'700' }} className={seculerOne.className}>REZA PUTRA</h1>
                                <h3 style={{ fontSize:'13px' }} className={lobster.className}>Fotocopy & Digital Printing</h3>
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
                    <div className='w-[50%] flex justify-end text-left'>
                        <div className='w-[350px] text-red-500 leading-6'>
                            <table>
                                <tr>
                                    <td className='w-[110px]'>Tanggal</td>
                                    <td>:</td>
                                    <td>...............</td>
                                </tr>
                                <tr>
                                    <td>To</td>
                                    <td>:</td>
                                    <td>...............</td>
                                </tr>
                            </table>
                            {/* <div>Cerih, ................</div>
                            <div>To: ......................</div> */}
                        </div>
                    </div>
                </div>
                <table className='table-fixed w-full mt-4'>
                    <thead>
                        <tr>
                            <th style={{ paddingTop:'0.375rem !important', paddingBottom:'0.375rem !important' }} className='border w-8'>No</th>
                            <th style={{ paddingTop:'0.375rem !important', paddingBottom:'0.375rem !important' }} className='border'>Nama</th>
                            <th style={{ paddingTop:'0.375rem !important', paddingBottom:'0.375rem !important' }} className='border w-80'>Harga</th>
                            <th style={{ paddingTop:'0.375rem !important', paddingBottom:'0.375rem !important' }} className='border w-40'>Jumlah</th>
                            <th style={{ paddingTop:'0.375rem !important', paddingBottom:'0.375rem !important' }} className='border'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item: IData, index: number) => (
                            <tr key={index}>
                                <td className='border'>{index}</td>
                                <td className='border'>{item.name}</td>
                                <td className='border'>{item.price.toLocaleString()}</td>
                                <td className='border'>{item.qty.toLocaleString()}</td>
                                <td className='border'>{item.total.toLocaleString()}</td>
                            </tr>
                        ))}
                        {data.length > 0 && (
                            <tr>
                                <td colSpan={4} className='border text-lg text-center font-bold'>Sub Total</td>
                                <td className='border text-lg text-center'>Rp. {grandTotal.toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            </div>

            <button onClick={capture} className='mr-8 border rounded-md px-4 py-1.5 bg-blue-700 text-white'>Kirim</button>


        </div>
    )
}

export default page
