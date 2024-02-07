import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import TerrainIcon from '@mui/icons-material/Terrain';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';

import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  // [Pages.Welcome]: {
  //   component: asyncComponentLoader(() => import('@/pages/Welcome')),
  //   path: '/',
  //   title: 'Welcome',
  //   icon: HomeIcon,
  // },
  // [Pages.Page1]: {
  //   component: asyncComponentLoader(() => import('@/pages/Page1')),
  //   path: '/page-1',
  //   title: 'Page 1',
  //   icon: GitHubIcon,
  // },
  // [Pages.Page2]: {
  //   component: asyncComponentLoader(() => import('@/pages/Page2')),
  //   path: '/page-2',
  //   title: 'Page 2',
  //   icon: AddTaskIcon,
  // },
  // [Pages.Page3]: {
  //   component: asyncComponentLoader(() => import('@/pages/Page3')),
  //   path: '/page-3',
  //   title: 'Page 3',
  //   icon: TerrainIcon,
  // },
  // [Pages.Page4]: {
  //   component: asyncComponentLoader(() => import('@/pages/Page4')),
  //   path: '/page-4',
  //   title: 'Page 4',
  //   icon: BugReportIcon,
  // },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
  [Pages.SignUp]: {
    component: asyncComponentLoader(() => import('@/pages/SignUp')),
    path: '/sign-up',
    title: 'SignUp',
    icon: PersonIcon,
  },
  [Pages.SignIn]: {
    component: asyncComponentLoader(() => import('@/pages/SignIn')),
    path: '/sign-in',
    title: 'SignIn',
    icon: LoginIcon,
  },
};

export default routes;
