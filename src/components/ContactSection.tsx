import { useState } from 'react'
import { motion } from 'framer-motion'

const socialLinks = [
  {
    name: 'GitHub',
    icon: '💻',
    url: 'https://github.com/NHRICH',
    color: '#6e5494'
  },
  {
    name: 'LinkedIn',
    icon: '🔗',
    url: 'www.linkedin.com/in/nahom-merhatsyon-8a606132a',
    color: '#0077b5'
  },
  {
    name: 'YouTube',
    icon: '🎥',
    url: 'https://www.youtube.com/@NhRich4',
    color: '#FF0000'
  },
  {
    name: 'Instagram',
    icon: '📸',
    url: 'https://instagram.com/nhrich4',
    color: '#E1306C'
  }
]

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    
    try {
      const response = await fetch('https://formspree.io/f/mzbnqlbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormStatus('success')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
        
        // Reset status after 3 seconds
        setTimeout(() => setFormStatus('idle'), 3000)
      } else {
        setFormStatus('error')
        setTimeout(() => setFormStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 3000)
    }
  }

  return (
    <section id="contact" className="section bg-secondary-dark relative">
      <div className="container mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">Get In</span> Touch
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-secondary-light bg-opacity-30 backdrop-blur-md p-8 rounded-lg border border-primary border-opacity-20"
          >
            <h3 className="text-2xl font-bold mb-6 text-primary">Send Me a Message</h3>
            
            <form onSubmit={handleSubmit} action="https://formspree.io/f/mzbnqlbb" method="POST" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary-dark border border-primary border-opacity-30 rounded-sm focus:border-primary focus:outline-none transition-colors text-white"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary-dark border border-primary border-opacity-30 rounded-sm focus:border-primary focus:outline-none transition-colors text-white"
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary-dark border border-primary border-opacity-30 rounded-sm focus:border-primary focus:outline-none transition-colors text-white"
                  placeholder="Project Inquiry"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-3 bg-secondary-dark border border-primary border-opacity-30 rounded-sm focus:border-primary focus:outline-none transition-colors text-white resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              
              <motion.button
                type="submit"
                className={`w-full py-3 px-6 rounded-sm font-bold uppercase tracking-wider transition-all ${
                  formStatus === 'sending' 
                    ? 'bg-primary bg-opacity-50 text-secondary cursor-wait'
                    : formStatus === 'success'
                    ? 'bg-green-500 text-white'
                    : formStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-primary text-secondary hover:bg-opacity-90'
                }`}
                whileHover={{ scale: formStatus === 'sending' ? 1 : 1.02 }}
                whileTap={{ scale: formStatus === 'sending' ? 1 : 0.98 }}
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' 
                  ? 'Sending...' 
                  : formStatus === 'success' 
                  ? 'Message Sent!' 
                  : formStatus === 'error' 
                  ? 'Error Sending' 
                  : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Contact Information</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary">
                    ✉️
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Email</h4>
                    <a 
                      href="mailto:hello@nahommerhatsyon.com"
                      className="text-text-secondary hover:text-primary transition-colors"
                    >
                      mrnh9199@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary">
                    📍
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Location</h4>
                    <p className="text-text-secondary">
                      Mekelle, Tigray, Ethiopia
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-primary">Connect With Me</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-secondary-light bg-opacity-30 backdrop-blur-sm rounded-lg border border-primary border-opacity-20 hover:border-opacity-100 transition-all"
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-2xl">{link.icon}</div>
                    <span className="font-medium">{link.name}</span>
                  </motion.a>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 text-center"
              >
                <a 
                  href="/src/assets/files/nahom-merhatsyon-resume.pdf"
                  download
                  className="inline-flex items-center space-x-2 text-primary hover:underline"
                >
                  <span>Download My Resume</span>
                  <span>📄</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-24 py-6 border-t border-primary border-opacity-20 text-center">
        <p className="text-text-secondary">
          © {new Date().getFullYear()} <span className="text-primary">Nahom Merhatsyon</span>. All rights reserved.
        </p>
      </div>
    </section>
  )
}

export default ContactSection 