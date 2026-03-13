/**
 * File: SkillSection.jsx
 * Author: Nick Hanson
 * Created On: March 10, 2026
 * Last Updated: March 11, 2026
 * Description: The skill section for the showcase site. **REPLACE**
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
 * - useState: A React hook for managing state.
 * - useEffect: A React hook for side effects.
 * - AppModal: A component to display a modal with a live demo of the app.
 * - trackVisit: A utility function to track visits to the projects page.
 * - LoadingSpinner: A component for display a spinner during loading times.
 */

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';

const SkillSection = () => {
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [processes, setProcesses] = useState([]);
  const [processesLoading, setProcessesLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      const start = Date.now();
      try {
        setSkillsLoading(true); // show spinner
        const response = await fetch('data/skills.json');
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setSkillsLoading(false), delay); // ⏳ delay cleanup
      }
    };
    const loadProcesses = async () => {
      const start = Date.now();
      try {
        setProcessesLoading(true);
        const response = await fetch('data/processes.json');
        const data = await response.json();
        setProcesses(data);
      } catch (error) {
        console.error("Error fetching processes:", error);
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 500 - elapsed);
        setTimeout(() => setProcessesLoading(false), delay); // ⏳ delay cleanup
      }
    }

    loadSkills();
    loadProcesses();
  }, []);

  return (
    <section className="pb-8">
      <h2 id="skills" className="text-2xl font-bold text-center text-gray-700 dark:text-gray-200 mb-6">
        My Skills
      </h2>

      {skillsLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
            2xl:grid-cols-7 gap-x-2 gap-y-8 justify-items-center">
          {skills.map((skill) => (
            <div key={skill.title}>
              <SkillCard skill={skill} type="skill" />
            </div>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-200 mt-10 mb-6">
        My Process
      </h2>
      {processesLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex justify-around flex-wrap gap-6 px-4 sm:px-6 2xl:px-16">
          {processes.map((process) => (
            <div key={process.title}>
              <SkillCard skill={process} type="process" width={process.width} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SkillSection;