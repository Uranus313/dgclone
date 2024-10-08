'use client'
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ScrollLinkComponent = () => {
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          router.push('/'); // Replace with your target page
        }
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [router]);

  return (
    <div ref={componentRef} className="your-component-class">
      {/* Your component content */}
      Scroll to this component to navigate to another page.
    </div>
  );
};

export default ScrollLinkComponent;
