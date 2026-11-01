import time
from collections import defaultdict, deque
from fastapi import HTTPException, Request

def limiter(max_calls: int, window: int):
    hits = defaultdict(deque)
    def dep(request: Request):
        q = hits[request.client.host if request.client else "unknown"]
        t = time.time()
        while q and q[0] < t - window:
            q.popleft()
        if len(q) >= max_calls:
            raise HTTPException(429, "Too many requests. Please try again later.")
        q.append(t)
    return dep
