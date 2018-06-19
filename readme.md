# Introduction

The front end architect is pretty much copied from the [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate/blob/master/docs/general/introduction.md). The link has introduction to the motivations behind the architect.

## Install

```bash
yarn
```

## Start local front end server

```bash
yarn start
```

## Test

Run all tests:
```bash
npm test
```

To generate test coverage report:

```bash
npm test -- --coverage
```

To only run a subset of tests:

```bash
npm test -- --findRelatedTests src/containers/StriimAccounts/tests/*
```

## Styleguide

It uses [react-styleguidist](https://github.com/styleguidist/react-styleguidist) to render the components individually under `src/components`.

```bash
npm run styleguide
```

# General Development Guideline

## Test Driven Development
Here is a [lecture video](https://www.infoq.com/presentations/testing-communication) about TDD, introducing the motivations behind writing good unit tests.

There are examples of how these tests should be done for different layers under a container. Please refer to the tests in `containers/StriimAccounts/tests`:

*index.test.js*: Test the logics at the `container` level. The `component` tests can be done similarly to this test.

*actions.test.js*: Test the `actions`

*reducer.test.js*: Test the `reducer` based on the action types

*saga.test.js*: Test the `saga` data layer logics on dispatched actions. For some tests, it would be easier to write saga tests using [redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan)

Please feel free to share your thoughts on how the tests should be done for these different layers.


## Containers as sub pages

There are pages container more than 3 levels of sub pages. Combining all the logics of the sub pages into a single page container could make the code base very difficult to maintain and difficult to schedule the development.

In an aim to isolate the complexities between the sub pages, the parent page container can use the sub routes to wire up the sub pages. This enable isolating the logics in the parent page container from their sub pages, as well as isolating the logics between the sub pages.

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

## Mock server API

Currently the backend API is mocked using [Json Server](https://github.com/typicode/json-server). `yarn start` includes the command to start up the json server and serve the mocked API at `8000` port.

Once the development backend API is ready, we will switch it to the development API url.

## Folders
 - *public*: We use [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the files to `build/public`. This folder would hold the assets such as images/fonts. These asset files can be referenced by path `/public/[path_of_asset_file]`.