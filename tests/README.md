# Tests

This folder contains Jest tests following the Lecture 19 structure:

- unit tests for logic-heavy code and edge cases
- integration-style tests for critical backend flows
- frontend component/helper tests for core user-facing behavior
- end-to-end style client flow tests using mocked routing/auth/API behavior

Run all tests from the repo root:

```bash
npm test
```

Run watch mode:

```bash
npm run test:watch
```

Current coverage groups:

- Unit:
  - `RelativeTime`
  - `getImageUrl`
  - service validation/business rules
- Integration:
  - `SkillsFilters`
  - `EditProfileModal`
  - `ReportModal`
  - `ProfilePosts`
  - `Navbar`
- End-to-end style:
  - `LoginForm` submit/error/ban redirect flow
