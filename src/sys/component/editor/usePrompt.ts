import { History, Transition } from 'history';
import { useCallback, useContext, useEffect } from "react";
import { Navigator } from 'react-router';
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import Message, { MessageType } from '../../system/Message'

/*
  Block router transitions
  Copied from https://stackoverflow.com/questions/71572678/react-router-v-6-useprompt-typescript

  [Licence]
  Created 20.09.22
  @editor John Stewart
 */

type ExtendNavigator = Navigator & Pick<History, "block">;

export function useBlocker(blocker: (tx: Transition) => void, when = true) {
    const { navigator } = useContext(NavigationContext);

    useEffect(() => {
        if (!when) return;

        const unblock = (navigator as ExtendNavigator).block((tx) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    unblock();
                    tx.retry();
                },
            };

            blocker(autoUnblockingTx);
        });

        return unblock;
    }, [navigator, blocker, when]);
}

export default function usePrompt(when = true, setMessage : any) {
    const blocker = useCallback((tx: Transition) => {
      var m = new Message()
      m.type = MessageType.unsaved
      m.transition = tx
      setMessage(m)
    }, []);

    useBlocker(blocker, when);
}