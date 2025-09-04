import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from 'next/link';

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  image?: string;
};

export default function ShowSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const schoolsList = useRef<School[]>([]);

  function filterSchools(text: string) {
    const lower = text.toLowerCase();
    setSchools(
      schoolsList.current.filter((school) =>
        school.name.toLowerCase().includes(lower) ||
        school.address.toLowerCase().includes(lower) ||
        school.city.toLowerCase().includes(lower)
      )
    );
  }

  useEffect(() => {
    fetch("/api/schools")
      .then((res) => res.json())
      .then((data: School[]) => {
        setSchools(data);
        setLoading(false);
        schoolsList.current = data;
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="relative">
      {/* 🔍 Search Input */}
      <div className="flex gap-2 p-2 md:p-4 sticky top-0 bg-white shadow">
        <input
          type="text"
          placeholder="Search"
          className=" bg-gray-200 p-2 w-full border border-gray-300 outline-0"
          onInput={(e) => filterSchools(e.currentTarget.value)}
        />
        <Link 
          className="bg-black text-white  p-2 px-4 h-fit"
          href="/addSchool"
        >
          Add
        </Link>
      </div>

      {/* 🏫 School Grid */}
      <div className="p-4 md:p-8 ">
        {
          loading ? <p className="text-center italic">Loading...</p>
          : <>
          {
            (schools && schools.length) ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {
                schools.map((school) => (
                  <div key={school.id} className="bg-gray-50 rounded-b-lg shadow">
                    {school.image && (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={school.image!}
                          alt={school.name}
                          fill
                          className="object-cover rounded-md cursor-pointer hover:p-2 transition-all ease-in-out"
                          onClick={() => setModalImage(school.image!)}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-xl font-semibold">{school.name}</h2>
                      <p>{school.address}</p>
                      <p>{school.city}</p>
                    </div>
                  </div>
                ))
              }
            </div>
             : <p className="text-center italic">No data found!</p>
          }
          </>
        }
        {}
      </div>

      {/* 🖼️ Modal */}
      {modalImage && (
<div
  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  onClick={() => setModalImage(null)}
>
  <div className="relative w-[90vw] h-[90vh]">
    <Image
      src={modalImage!}
      alt="Full size"
      fill
      className="object-contain rounded"
      onClick={(e) => e.stopPropagation()}
    />
    <button
      type="button"
      onClick={() => setModalImage(null)}
      className="absolute top-1 right-1 bg-black text-white border-2 border-white w-8 h-8 rounded-full text-sm cursor-pointer"
      title="Remove image"
    >
      ×
    </button>
  </div>
</div>

      )}
    </div>
  );
}
