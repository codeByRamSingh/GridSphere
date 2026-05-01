"""BaseAgent — abstract contract every AI agent must implement.

Each agent is a three-phase pipeline:
  1. context_loader  — gather data needed for a decision
  2. decision_engine — rules + optional LLM call → structured decision
  3. action_executor — carry out the decision and return output

To plug in an LLM, override decision_engine and call your provider
inside the `# LLM INTEGRATION POINT` section.  The rest of the pipeline
(logging, timing, DB persistence) stays unchanged.
"""

import logging
import time
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger("gridsphere.agents")


def _iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class BaseAgent(ABC):
    name: str = "BaseAgent"

    # ── Public entry point ─────────────────────────────────────────────────────

    def run(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        """Execute the full pipeline and return a structured result dict."""
        t0 = int(time.time() * 1000)
        log: list[dict[str, Any]] = []

        try:
            log.append({"step": "context_loader", "status": "starting", "ts": _iso()})
            context = self.context_loader(input_payload)
            log.append({"step": "context_loader", "status": "done", "ts": _iso()})

            log.append({"step": "decision_engine", "status": "starting", "ts": _iso()})
            decision = self.decision_engine(context)
            log.append({"step": "decision_engine", "status": "done", "decision_keys": list(decision.keys()), "ts": _iso()})

            log.append({"step": "action_executor", "status": "starting", "ts": _iso()})
            output = self.action_executor(decision)
            log.append({"step": "action_executor", "status": "done", "ts": _iso()})

            duration = int(time.time() * 1000) - t0
            logger.info("[%s] completed in %dms", self.name, duration)
            return {"status": "completed", "output": output, "decision_log": log, "duration_ms": duration}

        except Exception as exc:
            logger.exception("[%s] failed: %s", self.name, exc)
            return {
                "status": "failed",
                "error": str(exc),
                "decision_log": log,
                "duration_ms": int(time.time() * 1000) - t0,
            }

    # ── Pipeline stages — must be implemented by each agent ──────────────────

    @abstractmethod
    def context_loader(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        """Load relevant context from DB / APIs / config."""
        ...

    @abstractmethod
    def decision_engine(self, context: dict[str, Any]) -> dict[str, Any]:
        """
        Produce a structured decision.

        # LLM INTEGRATION POINT
        To use an LLM, build a prompt from `context`, call your provider:

            from openai import OpenAI
            client = OpenAI()
            resp = client.chat.completions.create(model="gpt-4o", messages=[...])
            return parse_llm_response(resp)

        For Anthropic Claude:

            import anthropic
            client = anthropic.Anthropic()
            resp = client.messages.create(model="claude-opus-4-7", ...)
            return parse_llm_response(resp)
        """
        ...

    @abstractmethod
    def action_executor(self, decision: dict[str, Any]) -> dict[str, Any]:
        """Execute the decision (write to DB, call APIs, send notifications)."""
        ...
