import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './page/DashboardPage';
import LandingPage from './page/LandingPage';
import RewardPage from './page/RewardPage';
import RewardSuccessPage from './page/RewardSuccessPage';
import RewardFailedPage from './page/RewardFailedPage';
import RecycleBinPage from './page/RecycleBinPage';
import ChallengePage from './page/ChallengePage';
import Recycle50PlasticPage from './page/Recycle50PlasticPage';
import CampusCleanupEventsPage from './page/CampusCleanupEventsPage';
import Recycle20GallonsPage from './page/Recycle20GallonsPage';

function GreenCampus() {
  return (
    <Routes>
      {/* Default landing page when visiting /Green-campus */}
      <Route path="/" element={<LandingPage />} />

      {/* Child routes — note they are now relative (no leading /) */}
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="reward" element={<RewardPage />} />
      <Route path="reward/success" element={<RewardSuccessPage />} />
      <Route path="reward/failed" element={<RewardFailedPage />} />
      <Route path="recycle" element={<RecycleBinPage />} />
      <Route path="challenge" element={<ChallengePage />} />
      <Route path="challenge/recycle-50-plastic" element={<Recycle50PlasticPage />} />
      <Route path="challenge/campus-cleanup-events" element={<CampusCleanupEventsPage />} />
      <Route path="challenge/recycle-20-gallons" element={<Recycle20GallonsPage />} />
    </Routes>
  );
}

export default GreenCampus;
