import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          Find Your Perfect College Housing
        </h1>
        <p className="text-xl text-neutral max-w-2xl mx-auto">
          Browse through our curated list of student-friendly housing options near your campus.
        </p>
        <Link
          to="/properties"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Start Browsing
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-2">
          <Building className="h-12 w-12 mx-auto text-secondary" />
          <h3 className="text-xl font-semibold text-primary">Quality Housing</h3>
          <p className="text-neutral">Verified properties that meet student needs</p>
        </div>
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 mx-auto text-secondary" />
          <h3 className="text-xl font-semibold text-primary">Prime Locations</h3>
          <p className="text-neutral">Close to campus and amenities</p>
        </div>
        <div className="text-center space-y-2">
          <Phone className="h-12 w-12 mx-auto text-secondary" />
          <h3 className="text-xl font-semibold text-primary">Easy Contact</h3>
          <p className="text-neutral">Direct communication with landlords</p>
        </div>
      </section>
    </div>
  );
}