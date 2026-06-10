"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GALLERY_IMAGES } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

export function GallerySection() {
  return (
    <section id="galeria" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            Galeria
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            MOMENTOS QUE FICAM PARA SEMPRE
          </h2>
        </FadeIn>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl"
            >
              <div className={`relative w-full ${img.tall ? "h-96" : "h-64"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition duration-500 group-hover:translate-y-0">
                  <p className="text-sm font-medium text-white">{img.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
