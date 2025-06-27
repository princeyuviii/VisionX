'use client';
import { Github, Linkedin, Instagram } from 'lucide-react';

export default function SocialLinks() {
  return (
    <div className="flex justify-center space-x-6 mt-16">
      <a href="https://github.com/princeyuviii" target="_blank" rel="noreferrer">
        <Github className="h-6 w-6 text-gray-600 hover:text-black" />
      </a>
      <a href="https://linkedin.com/in/princeyuvi" target="_blank" rel="noreferrer">
        <Linkedin className="h-6 w-6 text-blue-600 hover:text-blue-800" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noreferrer">
        <Instagram className="h-6 w-6 text-pink-500 hover:text-pink-700" />
      </a>
    </div>
  );
}