# Omphalos UI (aka Hubii Core)

> Omphalos UI is the user interface for the Omphalos project, by Hubii. Send and recieve crypto assets, and trustlessly trade with striim on this desktop wallet application.

## Architecture

Omphalos UI is a multiplatform desktop application built with Electron, React, Redux and styled-components. The architecture is heavily influenced the [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate/blob/master/docs/general/introduction.md) project. To understand our design decisions in greater detail, we recommend you checkout the documentaion and reasoning outlined in that repository.

## Setup

### Requirements

* NodeJS LTS
* Yarn LTS

## Install

```bash
yarn # install dependencies
yarn electorn-build # step will not be necesarry after issue #207 is resolved
```

## Run in Electron (recommended)

```bash
yarn electron-dev
```

## Run in browser

```bash
yarn start
```

## Lint

```bash
yarn lint
```

## Test everything

```bash
yarn test
```

## Test only what's changed since the last commit

```bash
yarn test:dev
```

## Build

```bash
yarn electron-build # builds and packages the app for your system architecture
```

## Styleguide

We use [react-styleguidist](https://github.com/styleguidist/react-styleguidist) to organise our component library

```bash
yarn styleguide
```

## Development Guidelines

### Gitflow

Please obey by established Gitflow principles. Details can be obtained in post by Vincent Driessen or in Atlassian's Gitflow Workflow tutorial. Driessen's git-flow git extension is indispensable.

### Test Driven Development

Here is a [video](https://www.infoq.com/presentations/testing-communication) about TDD, introducing the motivations behind writing good unit tests.

For examples on how to write tests for different parts of a container, please refer to the tests in `containers/StriimAccounts/tests`:

*index.test.js*: Test the logics at the `container` level. `component` tests can be constructed similarly to this.

*actions.test.js*: Test any `actions`

*reducer.test.js*: Test the container `reducer`

*saga.test.js*: Test any `saga` logic. We recommend and are currently migrating all our saga tests to use [redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan)

### Containers as sub pages

Some containers contain up to 3 levels of complex components. Combining all the logic of each component into a single container could make the code difficult to maintain and difficult to schedule development.

To isolate the complexities between the sub components, the parent container can use sub routes to wire up the sub components. This enable isolating the logics in the parent page container from their sub pages, as well as isolating the logics between the sub pages.

Take the Striim tab page for example, the sub pages structured like: `containers/Striim` > `containers/StrrimAccounts` > `containers/SwapCurrencies`

`containers/Striim` container is the parent page of the sub pages `accounts` and `contacts`. It  handles its own container logics and only know about the sub route path for its child containers. When the route matches `/accounts`, it renders `StriimAccountsContainer`.

Sample codes from `containers/Striim`:

```js
<StriimTabs defaultActiveKey={history.location.pathname}>
    <TabPane tab="Accounts" key={`${match.url}/accounts`}>
        <Route path={`${match.url}/accounts`} component={StriimAccountsContainer} />
    </TabPane>
    <TabPane tab="Contacts" key={`${match.url}/contacts`}>
        Content of Tab Pane 2
    </TabPane>
</StriimTabs>
```

`containers/StriimAccounts` container is the parent page of a number of sub pages such as `payment`, `savings`, `swap currencies` etc. Although it has quite a number of sub pages, it handles its own container logics and have the sub pages to handle by them own.

In order to let the sub pages know which account and currency is currently chosen, it dispatch the actions `CHANGE_CURRENT_CURRENCY` or `CHANGE_CURRENT_ACCOUNT`, so the sub pages can react respectively.

Take Swap Currency sub page for example, it connects the `currentCurrency` with the state in the  `store` using [reselect](https://github.com/reduxjs/reselect). Whenever there is an update to this `currentCurrency` state, the swap currency container re-render the view to reflect the newly chosen currency from its parent container `containers/StriimAccounts`.

Sample codes from `containers/SwapCurrencies` on connecting the props to the defined states from the `store`.

```js
import { makeSelectCurrentCurrency } from 'containers/StriimAccounts/selectors';
const mapStateToProps = createStructuredSelector({
  currentCurrency: makeSelectCurrentCurrency(),
});
```

## Mock API

Currently the backend API is mocked using [json-server](https://github.com/typicode/json-server). `yarn start` includes the command to start up the json server and serve the mocked API from port `8000`.

Once the backend API is ready, we will use it instead of json-server.

## Folders

*Section WIP*

*public*: We use [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the files to `build/public`. This folder would hold the assets such as images/fonts. These asset files can be referenced by path `/public/[path_of_asset_file]`.