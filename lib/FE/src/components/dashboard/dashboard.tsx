import React from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline'
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/outline'



const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>דאשבורד</h1>
      <p>ברוך הבא לדאשבורד! כאן תוכל לראות סקירה כללית של המערכת.</p>
      {/*דוגמא לשימוש באיקונים*/}
      <ArrowDownOnSquareStackIcon style={{ width: '24px', height: '24px' }} />
      <BeakerIcon className="size-6 text-blue-500" />
      <XCircleIcon className="size-6 text-blue-500" />


    </div>
  );
};

export default Dashboard;
