// Gallery.tsx
'use client'

type GalleryItem = {
  src: string
  title: string
}

const galleryItems: GalleryItem[] = [
  { src: '/gallery/Img1.jpg', title: 'Old-Money Style' },
  { src: '/gallery/Img2.jpg', title: 'Smart Casual ' },
  { src: '/gallery/Img3.jpg', title: 'Ethnic Royal Kurta' },
  { src: '/gallery/Img4.jpg', title: 'Retro Street ' },
  { src: '/gallery/Img5.jpg', title: 'Formal Wear' },
  { src: '/gallery/Img6.jpg', title: 'Smart Fit' },
]

export default function Gallery() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Fashion Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-4 text-center bg-white">
              <h2 className="text-lg font-semibold">{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}