import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';

export function useChatScroll({ chatId, messages, hasMore, loadMoreItems }) {
    const containerRef = useRef(null);
    
    // State tracking refs to survive remounts/renders perfectly
    const prevFirstMessageIdRef = useRef(null);
    const prevLastMessageIdRef = useRef(null);
    const prevChatIdRef = useRef(null);
    const wasAtBottomRef = useRef(true);
    const scrollHeightRef = useRef(0);
    const isLoadingMoreRef = useRef(false);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        // Are we currently anchored to the very bottom? 
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        wasAtBottomRef.current = isNearBottom;

        // Have we scrolled to the absolute top to load more?
        if (container.scrollTop < 50 && hasMore && !isLoadingMoreRef.current) {
            // Ensure a scrollbar actually exists to prevent useless rapid fetches
            if (container.scrollHeight > container.clientHeight) {
                isLoadingMoreRef.current = true;
                // Freeze the height snapshot immediately before the network request
                scrollHeightRef.current = container.scrollHeight;
                loadMoreItems();
            }
        }
    }, [hasMore, loadMoreItems]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container || !messages || messages.length === 0 || !chatId) {
            return;
        }

        const currentFirstId = messages[0].id;
        const currentLastId = messages[messages.length - 1].id;

        // 1. SCENARIO: A completely different user's chat was opened.
        if (prevChatIdRef.current !== chatId) {
            container.scrollTop = container.scrollHeight;
            wasAtBottomRef.current = true;
            isLoadingMoreRef.current = false;
        } 
        // 2. SCENARIO: Pagination triggered & older messages just rendered at the top.
        else if (prevFirstMessageIdRef.current && currentFirstId !== prevFirstMessageIdRef.current) {
            // Shift the scroll position down perfectly by the height of the new injected DOM.
            const heightDiff = container.scrollHeight - scrollHeightRef.current;
            container.scrollTop += heightDiff;
            isLoadingMoreRef.current = false;
        } 
        // 3. SCENARIO: A brand new incoming or sent message was appended to the bottom.
        else if (prevLastMessageIdRef.current && currentLastId !== prevLastMessageIdRef.current) {
            // Only snap downward if the user was ALREADY reading the bottom.
            if (wasAtBottomRef.current) {
                container.scrollTop = container.scrollHeight;
            }
        }

        // Sync all our layout records for the next cycle
        prevChatIdRef.current = chatId;
        prevFirstMessageIdRef.current = currentFirstId;
        prevLastMessageIdRef.current = currentLastId;
        scrollHeightRef.current = container.scrollHeight;

    }, [messages, chatId]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // we apply overflowAnchor to block modern browsers from secretly interfering with React's position update
            container.style.overflowAnchor = 'none'; 
            
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, messages]);

    const scrollToBottom = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
            wasAtBottomRef.current = true;
        }
    }, []);

    return { containerRef, scrollToBottom };
}
