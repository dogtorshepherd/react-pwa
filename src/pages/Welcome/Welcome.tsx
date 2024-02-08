import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Welcome() {
  return (
    <>
      <Meta title="welcome" />
      <FullSizeCenteredFlexBox>
        <Typography variant="h3">Welcome</Typography>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Welcome;
