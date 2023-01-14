import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imgUrl, setImgUrl] = useState('');

  function viewImage(url): void {
    setImgUrl(url);
    onOpen();
  }

  // TODO FUNCTION HANDLE VIEW IMAGE

  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        {cards.map(card => (
          <Card data={card} viewImage={viewImage} key={card.id} />
        ))}
      </SimpleGrid>

      <ModalViewImage imgUrl={imgUrl} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
