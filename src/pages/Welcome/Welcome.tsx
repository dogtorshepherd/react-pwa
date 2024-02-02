import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Welcome() {
  return (
    <>
      <Meta title="Welcome Page" />
      <FullSizeCenteredFlexBox>
        <Typography variant="h3">Welcome Page</Typography>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Welcome;
