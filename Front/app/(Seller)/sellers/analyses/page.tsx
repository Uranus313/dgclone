import React from 'react'
import LinearChart from './LinearChart'
import Link from 'next/link'
import Checkbox from '../products/Checkbox'


const views={
    recentViewChart:[
        {value:87 , date:'2024-08-08'},
        {value:43 , date:'2024-08-09'},
        {value:30 , date:'2024-08-10'},
        {value:900 , date:'2024-08-11'},
        {value:453 , date:'2024-08-12'},
        {value:300 , date:'2024-08-13'},
        {value:30 , date:'2024-08-14'},
        {value:122 , date:'2024-08-15'},
        {value:670 , date:'2024-08-16'},
        {value:45 , date:'2024-08-17'},
        {value:20 , date:'2024-08-18'},
        {value:10 , date:'2024-08-19'},
        {value:400 , date:'2024-08-20'},
        {value:50 , date:'2024-08-21'},
        {value:800 , date:'2024-08-22'}],

    totalViews:{count:4503,growth:+4},
    productVarients:{count:10,growth:-21},
    mostViewdProduct:{title:'لپتاپ ایسوز',productID:'3',productLink:'sth',viewCount:1029}

}

const income={
    recentIncomeChart:[
        {value:98070 , date:'2024-08-08'},
        {value:40023 , date:'2024-08-09'},
        {value:30003 , date:'2024-08-10'},
        {value:95000 , date:'2024-08-11'},
        {value:40053 , date:'2024-08-12'},
        {value:30030 , date:'2024-08-13'},
        {value:0 , date:'2024-08-14'},
        {value:112022 , date:'2024-08-15'},
        {value:167030 , date:'2024-08-16'},
        {value:3450 , date:'2024-08-17'},
        {value:20000 , date:'2024-08-18'},
        {value:44100 , date:'2024-08-19'},
        {value:44000 , date:'2024-08-20'},
        {value:5000 , date:'2024-08-21'},
        {value:80000 , date:'2024-08-22'}],

    totalIncome:{total:4500003,growth:+4},
    productVarients:{count:10,growth:-21},
    bestSellerProduct:{title:'لپتاپ ایسوز',productID:'3',productLink:'sth',sellCount:19}

}


const Analyses = () => {
  return (
    <div className='mt-10'>
        <div className='bg-white rounded-lg mb-5 py-5 border border-grey-border'>
            <div className="dropdown mx-3">
            <div tabIndex={0} role="button" className="  bg-primary-seller text-white rounded-md px-4 py-2  text-lg">بازه ی زمانی</div>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
                <Checkbox index={1} id={'1week'} title={"یک هفته گذشته"} query='timePeriod' />
                <Checkbox index={1} id={'2week'} title={"دو هفته گذشته"} query='timePeriod' />
                <Checkbox index={0} id={"1month"} title={"ماه گذشته"} query='timePeriod' />
            </div>
            </div>

        </div>

        <div className='grid grid-cols-10 rounded-lg border bg-white p-5  border-grey-border mb-5' style={{height:'480px'}}>
           <h2 className='col-span-full text-lg p-5 pt-0 border-b border-grey-border'>گزارش بازدید</h2>
            <div className='col-span-6 border-l border-grey-border'>
                <LinearChart data={views.recentViewChart}/>
            </div>
            <div className='col-span-4 grid grid-cols-2 justify-between items-center p-5'>
                <p>تعداد بازدید در بازه زمانی</p>
                <div className='justify-self-end flex flex-col items-end'>
                    <p className='text-xl font-bold'>{views.totalViews.count}<span className='text-xs text-grey-dark mx-1'>عدد</span></p>
                    <p className='mt-3 text-grey-dark'><span className={`${views.totalViews.growth>0&&'text-greener-box'} ${views.totalViews.growth<0&&'text-red-box'}`}>
                        {views.totalViews.growth>0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>}
                        {views.totalViews.growth<0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>}
                        {views.totalViews.growth}%

                        </span> نسبت به بازه ی گذشته</p>
                </div>
                <hr className='col-span-2 text-grey-border'></hr>
                <p>تعداد تنوع کالا های بازدید شده</p>
                <div className='justify-self-end flex flex-col items-end'>
                    <p className='text-xl font-bold'>{views.productVarients.count}<span className='text-xs text-grey-dark mx-1'>عدد</span></p>
                    <p className='mt-3 text-grey-dark'><span className={`${views.productVarients.growth>0&&'text-greener-box'} ${views.productVarients.growth<0&&'text-red-box'}`}>
                        {views.productVarients.growth>0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>}
                        {views.productVarients.growth<0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>}
                        {views.productVarients.growth}%

                        </span> نسبت به بازه ی گذشته</p>
                </div>
                <hr className='col-span-2 text-grey-border'></hr>
                <p>پر بازدید ترین کالا</p>
                <div className='justify-self-end flex flex-col items-end'>
                    <Link className='text-primary-seller font-bold justify-self-end' href={views.mostViewdProduct.productLink}><p>{views.mostViewdProduct.title}</p></Link>
                    <p className='mt-3 text-grey-dark'><span className='font-bold text-primary-seller'>{views.mostViewdProduct.viewCount}</span> بازدید در بازه ی زمانی</p>
                </div>
                <hr className='col-span-2 text-grey-border'></hr>

            </div>
        </div>


        <div className='grid grid-cols-10 rounded-lg border bg-white p-5  border-grey-border mb-5' style={{height:'480px'}}>
           <h2 className='col-span-full text-lg p-5 pt-0 border-b border-grey-border'>گزارش فروش ناخالص</h2>
            <div className='col-span-6 border-l border-grey-border'>
                <LinearChart data={income.recentIncomeChart}/>
            </div>
            <div className='col-span-4 grid grid-cols-2 justify-between items-center p-5'>
                <p>مبلغ فروش در بازه زمانی</p>
                <div className='justify-self-end flex flex-col items-end'>
                    <p className='text-xl font-bold'>{income.totalIncome.total}<span className='text-xs text-grey-dark mx-1'>تومان</span></p>
                    <p className='mt-3 text-grey-dark'><span className={`${income.totalIncome.growth>0&&'text-greener-box'} ${income.totalIncome.growth<0&&'text-red-box'}`}>
                        {income.totalIncome.growth>0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>}
                        {income.totalIncome.growth<0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>}
                        {income.totalIncome.growth}%

                        </span> نسبت به بازه ی گذشته</p>
                </div>
                <hr className='col-span-2 text-grey-border'></hr>
                <p>تعداد تنوع کالا های فروخته‌شده</p>
                <div className='justify-self-end flex flex-col items-end'>
                    <p className='text-xl font-bold'>{income.productVarients.count}<span className='text-xs text-grey-dark mx-1'>عدد</span></p>
                    <p className='mt-3 text-grey-dark'><span className={`${income.productVarients.growth>0&&'text-greener-box'} ${income.productVarients.growth<0&&'text-red-box'}`}>
                        {income.productVarients.growth>0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>}
                        {income.productVarients.growth<0 && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                        </svg>}
                        {income.productVarients.growth}%

                        </span> نسبت به بازه ی گذشته</p>
                </div>
                <hr className='col-span-2 text-grey-border'></hr>
                <p>پر بازدید ترین کالا</p>
                <div className='justify-self-end flex flex-col items-end'>
                    <Link className='text-primary-seller font-bold justify-self-end' href={income.bestSellerProduct.productLink}><p>{income.bestSellerProduct.title}</p></Link>
                    <p className='mt-3 text-grey-dark'><span className='font-bold text-primary-seller'>{income.bestSellerProduct.sellCount}</span> بازدید در بازه ی زمانی</p>
                </div>
                <hr className='col-span-2 text-grey-border'></hr>

            </div>
        </div>

    </div>
  )
}

export default Analyses