import React from 'react'

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <p className="text-white">
          Copyright © {new Date().getFullYear()} Vincenzo. All rights reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
