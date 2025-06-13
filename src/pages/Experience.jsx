/**
 * File: Experience.jsx
 * Author: Nick Hanson
 * Created On: June 13, 2024
 * Created On: June 13, 2024
 * Description: The experience page for the showcase site.
 *
 * Props:
 * - None
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */

import React, { useState, useEffect } from 'react';
import { trackVisit } from "../utils/visitTracker";

const AboutMe = () => {

  useEffect(() => {
    trackVisit();
  }, []);

  const sections = [
    {
        "companyName": "Stihl Midwest",
        "companyCity": "Cottage Grove",
        "companyState": "WI",
        "jobTitle": "Warehouse Support A",
        "employmentDates": "Sept 2021—July 2023",
        "jobSummary": "At Stihl I was in charge of the shipping/receiving area of the warehouse where I was responsible for ensuring the timely departure of all large outbound orders and inbound products/supplies. This included everything from wrappingpre-picked pallet orders to creating B.O.L.s (Bill of Lading) for each order and informing each freight company of the need for pickup to loading/unloading of all trucks. During 'booking season' (the busiest time of year) we had days fo shipping more than one million dollars in product.",
        "jobHighlights": [
            "Promoted from Picker/Packer to oversee shipping and receiving operations.",
            "Managed logistics for outbound orders exceeding $1 million during peak season.",
            "Coordinated freight pickups, prepared shipping documents (B.O.L.), and ensured timely deliveries.",
            "Streamlined order fulfillment for faster turnaround times by optimizing picking and packing procedures.",
            "Used hand-held devices and computers to record and monitor inventory levels.",
            "Ensured accurate inventory counts through regular audits and meticulous recordkeeping.",
            "Reduced product damages with proper handling techniques and training for warehouse staff.",
            "Coordinated shipping schedules with carriers to ensure on-time delivery of goods while minimizing transportation costs.",
            "Managed inbound shipments by unloading trucks, checking items against invoices, and properly storing products in designated locations.",
            "Processed outbound orders accurately by picking merchandise according to packing slips and preparing shipments for transport.",
            "Operated various types of material handling equipment safely including forklifts, pallet jacks, and hand trucks to move heavy loads throughout the warehouse facility.",
            "Participated in regular team meetings, contributing to the development of new strategies for warehouse efficiency and productivity."
        ]
    },
    {
        companyName: "Global Energy Options",
        companyCity: "Madison",
        companyState: "WI",
        jobTitle: "Project Manager",
        employmentDates: "Feb 2006—September 2021",
        jobSummary: "My main job for ~15 years - I have had many positions and responsibilites with the company. Some of the commercial/industrial governament agencies/businesses we have consulted with include Forest Products Labs (FPL) and Memorial Veterans Hospital. Also worked for projects involving many residential homes/neighborhoods - consulting with companies such as WECC. I have obtained a wide knowledge base from working here, from installing energy monitoring equipment, to complete house remodeling with focus on energy efficiency research, to project management, to IT",
        jobHighlights: [
            "Identified plans and resources required to meet project goals and objectives.",
            "Accomplished client goals by providing quality technical projects.",
            "Performed energy audits on commercial/residential buildings.",
            "Collected and organized data and developed data visualizations to perform quantitative analyses.",
            "Gathered and analyzed field information to assess current costs, problems and potential for energy savings.",
            "Recommended energy-efficient technologies.",
            "Installed new energy-efficient appliances and control systems.",
            "Educated customers how to reduce energy use and cut costs with proactive strategies."
        ]
    },
        {
        companyName: "Clasen Quality Chocolates",
        companyCity: "Middleton",
        companyState: "WI",
        jobTitle: "Refiner Team Lead",
        employmentDates: "November 2003—July 2005",
        jobSummary: "Started working for the company through a temp agency (Celerity Staffing Solutions) in a temporary position. Clasen Quality Coatings (CQC - Now going by 'Clasen Quality Chocolates') brought mt on as a full employee a couple months later, and promoted me from the starting postion of 'Boxer' to a postion in the refining department called 'Tester.' After a month or so I was then promoted to 'Refiner', skipping the usual prerequisite postion of 'Mixer'. The Refiner was the head of the Refining Department and was the top non-supervisor postion in the production side of the business. During this time I broke the record for number of conches completed during a single shift, which at the time--if not still current), was 17 conches.",
        jobHighlights: [
            "Responsible for efficiently running the Refining Department with focus on quality.",
            "Coached team members in techniques necessary to complete job tasks and lead them in their duties, including the 'Tester', 'Mixers' and refining assistants.",
            "Operated pre-refining and refining machines, measuring fineness and ensuring quality standards.",
            "Accurately calculated and added oil to conches and tanks to adjust viscosity.",
            "Recorded any relevant information about each refining run. This includes average fineness, amount of oil used, conch/tank viscosities, etc.",
            "Evaluated employee skills and knowledge regularly, and trained and mentored individuals with lagging skills.",
            "Broke the record for number of conches completed during a single standard shift, which at the time – if not still – was 17 conches."
        ]
    },
  ];

  const [expanded, setExpanded] = useState(null);

  const toggleSection = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-600 xl:max-w-6xl lg:max-w-4xl mx-auto p-4">
      <h1 className="text-gray-600 dark:text-gray-300 text-4xl font-bold text-center mb-6">Experience</h1>
      {sections.map((section, index) => (
        <div key={index} className="text-gray-800 bg-gray-300 dark:bg-gray-300 mb-4 border-b
            border-gray-500 dark:border-gray-800">
          <button
            className="w-full text-left py-2 px-4 font-semibold text-lg flex justify-between items-center"
            onClick={() => toggleSection(index)}
          >
            <div className="flex justify-between w-full pr-4 font-normal">
                <div><span className="text-xl font-semibold">{section.companyName} | </span>{section.companyCity}, {section.companyState}</div>
                <div>{section.employmentDates}</div>
            </div>
            <span className="text-gray-500 dark:text-gray-800">
              {expanded === index ? "▲" : "▼"}
            </span>
          </button>
          <p className="px-4 py-2 text-gray-700 hover:text-lg">{section.jobTitle}</p>
          {expanded === index && (
            <div className="px-4 pb-4 text-gray-600">
                <hr className="border-gray-400 my-2" />

                <p className="px-4 py-2 text-gray-700">{section.jobSummary}</p>
                <div className="px-4">
                    <ul className="list-disc list-inside px-2">
                        {section.jobHighlights.map((item, index) => (
                            <li key={index}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          )}
        </div>
      ))}
      <div className="mt-24 pb-24 flex flex-col text-center content-center flex-wrap hover:scale-110">
        <h2 className="text-gray-600 dark:text-gray-100 text-3xl font-bold">Powered By:</h2>
        <img src="/images/NH-Circuit-Logo.webp" width="30%" alt="Nick Hanson Circuit Logo" />
      </div>
    </div>
  );
};

export default AboutMe;