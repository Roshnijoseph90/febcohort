import React from 'react';
import { Skeleton, Card } from 'antd';

const MovieCardSkeleton = () => {
  return (
    <Card style={{ width: 240 }} cover={<Skeleton.Image />} >
      <Skeleton loading={true} active>
        <Card.Meta
          title={<Skeleton.Input style={{ width: 200 }} active />}
          description={<Skeleton.Input style={{ width: 150 }} active />}
        />
      </Skeleton>
      <Skeleton.Button style={{ width: 120, marginTop: 16 }} active />
    </Card>
  );
};

export default MovieCardSkeleton;

