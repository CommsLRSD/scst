import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class OverlayStartupTests(unittest.TestCase):
    def test_dialog_elements_are_hidden_in_markup(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")

        for element_id in ("searchOverlay", "personModal", "scrim"):
            match = re.search(
                rf"<[^>]*\bid=[\"']{re.escape(element_id)}[\"'][^>]*>",
                html,
                re.IGNORECASE,
            )
            self.assertIsNotNone(match, f"Missing element with id={element_id}")
            self.assertRegex(match.group(0), r"\bhidden\b")

    def test_hidden_attribute_enforced_by_css_rule(self):
        css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
        rule_match = re.search(r"\[hidden\]\s*\{([^}]*)\}", css, re.IGNORECASE | re.DOTALL)
        self.assertIsNotNone(rule_match, "Missing [hidden] CSS rule")
        self.assertRegex(rule_match.group(1), r"display\s*:\s*none\s*!important\s*;?")

    def test_search_open_is_only_called_from_user_shortcut_handler(self):
        js = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        call_matches = list(re.finditer(r"\bopenSearch\(\);", js))
        self.assertEqual(len(call_matches), 1, "Unexpected number of openSearch() calls")

        call_pos = call_matches[0].start()
        context_window = js[max(0, call_pos - 260) : call_pos + 80]
        self.assertIn('if (e.key === "/"', context_window)


if __name__ == "__main__":
    unittest.main()
