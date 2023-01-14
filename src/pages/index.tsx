import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { AxiosResponse } from 'axios';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface GetPagesResponse {
  pages: {
    data: {
      title: string;
      description: string;
      url: string;
      ts: number;
      id: string;
    }[];
    after: string;
  }[];
}

interface FormattedDataResponse {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

export default function Home(): JSX.Element {
  function getImages({
    pageParam = null,
  }): Promise<AxiosResponse<GetPagesResponse>> {
    return api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
  }

  function getNextPageParam(lastRequest): number | null {
    const { after } = lastRequest;
    if (after) return after;
    return null;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImages, {
    getNextPageParam,
  });

  const formattedData = useMemo(() => {
    if (data) {
      return data.pages[0].data.data;
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <h1>opa</h1>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
