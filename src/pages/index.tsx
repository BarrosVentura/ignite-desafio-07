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
    const {
      data: { after },
    } = lastRequest;
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

  const formattedData: FormattedDataResponse[] = useMemo(() => {
    if (data) {
      return data.pages.map(page => page.data.data).flat();
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
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} marginTop={10}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}

        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
