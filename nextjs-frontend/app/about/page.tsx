'use client'

import { motion } from 'framer-motion'
import { FaHeart, FaLeaf, FaUsers, FaAward, FaQuoteLeft, FaStar, FaMedal, FaUtensils } from 'react-icons/fa'

const stats = [
  { number: '15+', label: 'Years of Excellence', icon: FaAward },
  { number: '50K+', label: 'Satisfied Guests', icon: FaUsers },
  { number: '3', label: 'Michelin Stars', icon: FaStar },
  { number: '25', label: 'Industry Awards', icon: FaMedal }
]

const values = [
  {
    icon: FaHeart,
    title: 'Culinary Artistry',
    description: 'Our dishes are more than food – they\'re expressions of creativity, culture, and passion perfected over decades.'
  },
  {
    icon: FaLeaf,
    title: 'Farm to Table',
    description: 'We partner with local organic farms within 100 miles, ensuring the freshest seasonal ingredients on your plate.'
  },
  {
    icon: FaUsers,
    title: 'Hospitality Excellence',
    description: 'Our award-winning service team is trained to anticipate your needs and create unforgettable experiences.'
  },
  {
    icon: FaAward,
    title: 'Uncompromising Standards',
    description: 'Every element, from ingredient sourcing to presentation, meets our rigorous quality benchmarks.'
  }
]

const team = [
  {
    name: 'Chef Marcus Laurent',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    credentials: 'Former Le Bernardin, 2 Michelin Stars'
  },
  {
    name: 'Sofia Chen',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400',
    credentials: 'James Beard Award Nominee'
  },
  {
    name: 'James Morrison',
    role: 'Sommelier',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    credentials: 'Master Sommelier, Court of MS'
  }
]

const timeline = [
  { year: '2010', title: 'Foundation', description: 'Chef Marcus Laurent opens Gastronome with a vision for accessible fine dining.' },
  { year: '2013', title: 'First Michelin Star', description: 'Recognized for culinary excellence and innovative New American cuisine.' },
  { year: '2016', title: 'Expansion', description: 'Opened private dining rooms and launched our acclaimed tasting menu.' },
  { year: '2019', title: 'Second Star', description: 'Awarded second Michelin star for continued innovation and quality.' },
  { year: '2022', title: 'Sustainability Award', description: 'Named "Most Sustainable Fine Dining Restaurant" by Green Restaurant Association.' },
  { year: '2026', title: 'Third Star', description: 'Achieved three Michelin stars, joining elite company of world\'s best restaurants.' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">Est. 2010</p>
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6">
                Where Passion Meets
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Perfection</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Gastronome represents the pinnacle of culinary achievement in New York City. Founded by Chef Marcus Laurent, we've earned three Michelin stars through our unwavering commitment to excellence, innovation, and the transformative power of exceptional cuisine.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our philosophy is simple: source the finest ingredients, treat them with respect, and create dishes that tell a story. Every plate that leaves our kitchen is a reflection of our passion and our promise to deliver an unforgettable dining experience.
              </p>
              <div className="flex items-center gap-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Michelin_3_Star.svg/200px-Michelin_3_Star.svg.png" alt="Michelin Stars" className="h-16 object-contain opacity-80" />
                <div>
                  <p className="text-charcoal font-semibold">Three Michelin Stars</p>
                  <p className="text-gray-500 text-sm">Exceptional cuisine, worth a special journey</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
                alt="Fine Dining Experience"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-amber-500 to-yellow-500 text-black p-6 rounded-xl shadow-xl">
                <p className="font-playfair text-4xl font-bold">Since</p>
                <p className="font-playfair text-5xl font-bold">2010</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-charcoal to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="text-amber-400 text-3xl mx-auto mb-4" />
                <p className="font-playfair text-5xl md:text-6xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">What We Believe</p>
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <value.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">The Culinary Artists</p>
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              World-class chefs bringing passion, innovation, and decades of expertise to your plate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-playfair text-2xl font-bold text-white">{member.name}</h3>
                    <p className="text-amber-400 font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                <p className="text-amber-600 text-sm font-medium mt-2">{member.credentials}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">Our Story</p>
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">The Journey</h2>
            <p className="text-gray-600">From vision to three Michelin stars</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-500 via-amber-400 to-yellow-400 rounded-full" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12 order-2'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-bold text-sm px-3 py-1 rounded-full mb-3">{item.year}</span>
                    <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full border-4 border-white shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-br from-charcoal via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FaQuoteLeft className="text-amber-500 text-5xl mx-auto mb-8" />
          <blockquote className="font-playfair text-3xl md:text-4xl text-white italic leading-relaxed mb-10">
            "Cooking is about passion, so it may look slightly temperamental in a way that it's too assertive to the naked eye. But that's because I want to paint the best picture possible."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100"
              alt="Chef Marcus Laurent"
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
            />
            <div className="text-left">
              <p className="text-white font-semibold text-lg">Chef Marcus Laurent</p>
              <p className="text-amber-400">Executive Chef & Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-black mb-4">
            Experience Gastronome
          </h2>
          <p className="text-black/70 text-lg mb-8">
            Reserve your table and discover why we've been awarded three Michelin stars
          </p>
          <a
            href="/reservation"
            className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-900 transition-colors"
          >
            Make a Reservation
          </a>
        </div>
      </section>
    </div>
  )
}
