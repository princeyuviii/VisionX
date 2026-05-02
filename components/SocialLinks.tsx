'use client';

import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialLinks() {
  const socials = [
    { icon: Github, href: "https://github.com/princeyuviii", label: "SRC_CODE" },
    { icon: Linkedin, href: "https://linkedin.com/in/princeyuvi", label: "NETWORK" },
    { icon: Instagram, href: "https://instagram.com", label: "VISUALS" },
    { icon: Twitter, href: "https://twitter.com", label: "UPDATES" }
  ];

  return (
    <div className="py-20 border-t border-white/5 flex flex-wrap justify-center gap-12">
      {socials.map((social, i) => (
        <motion.a 
          key={i}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-4 group"
          whileHover={{ y: -2 }}
        >
          <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <social.icon className="h-5 w-5 text-zinc-700 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-800 group-hover:text-zinc-500 transition-colors uppercase font-black">
            {social.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
}