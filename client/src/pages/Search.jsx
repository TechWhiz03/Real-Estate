
export default function Search() {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
                <form className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold text-sky-800'>
                            Search Term:
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className='border rounded-lg p-3 w-full'
                        // value={sidebardata.searchTerm}
                        // onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold text-sky-800'>
                            Type:
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='all'
                                className='w-5'
                            // onChange={handleChange}
                            // checked={sidebardata.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='rent'
                                className='w-5'
                            // onChange={handleChange}
                            // checked={sidebardata.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='sale'
                                className='w-5'
                            // onChange={handleChange}
                            // checked={sidebardata.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='offer'
                                className='w-5'
                            // onChange={handleChange}
                            // checked={sidebardata.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold text-sky-800'>
                            Amenities:
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='parking'
                                className='w-5'
                            // onChange={handleChange}
                            // checked={sidebardata.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='furnished'
                                className='w-5'
                            // onChange={handleChange}
                            // checked={sidebardata.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold text-sky-800'>
                            Sort:
                        </label>
                        <select
                            // onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id='sort_order'
                            className='border rounded-lg p-2'
                        >
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to hight</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-sky-600 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>

            <div className="flex-1">
                <h1 className='text-3xl font-semibold border-b p-3 text-sky-700 mt-5'>
                    Listing Results:
                </h1>
            </div>
        </div>
    )
}
