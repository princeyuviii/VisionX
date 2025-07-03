'use client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    name: 'Riya Kapoor',
    quote: 'VisionX helped me finally pick styles that actually suit me!',
  },
  {
    name: 'Aman Verma',
    quote: 'The AR feature feels like magic. Super easy and fun to use!',
  },
  {
    name: 'Neha Sharma',
    quote: 'Highly recommend to every fashion lover out there!',
  },
];

export default function TestimonialsCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="my-16 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">What People Say</h2>
      <Slider {...settings}>
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-8 shadow-lg text-center">
            <p className="text-lg italic text-gray-700">“{t.quote}”</p>
            <p className="mt-4 font-semibold text-purple-600">{t.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}