import React from 'react';
import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import Message from '../Message/Message';
import { MESSAGE_ADDED } from '../../constants';

const MessagesList = styled(FlatList)`
  width: 100%;
  padding: 1%;
`;

const ConversationBody = ({ subscribeToMore, userName, messages }) => {
  React.useEffect(() => {
    subscribeToMore({
      document: MESSAGE_ADDED,
      variables: { userName },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previous;
        }

        console.log('\n====subscriptionData=====\n');
        console.log(subscriptionData);

        const messageAdded = subscriptionData.data.messageAdded;

        return Object.assign({}, previous, {
          conversation: {
            ...previous.conversation,
            messages: [...previous.conversation.messages, messageAdded]
          }
        });
      }
    });
  }, []);

  return (  
    <MessagesList
      data={messages}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <Message align={item.userName === 'me' ? 'left' : 'right'}>{item.text}</Message>
      )}
    />
  );
};

export default ConversationBody;
