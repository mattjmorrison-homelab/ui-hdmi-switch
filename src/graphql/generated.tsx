/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HdmiInput =
  | 'APPLE_TV'
  | 'GOOGLE_TV'
  | 'PS3'
  | 'PS4'
  | 'SWITCH';

export type CurrentInputQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentInputQuery = { currentInput: HdmiInput };

export type SetInputMutationVariables = Exact<{
  input: HdmiInput;
}>;


export type SetInputMutation = { setInput: HdmiInput };


export const CurrentInputDocument = gql`
    query CurrentInput {
  currentInput
}
    `;

/**
 * __useCurrentInputQuery__
 *
 * To run a query within a React component, call `useCurrentInputQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentInputQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentInputQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentInputQuery(baseOptions?: Apollo.QueryHookOptions<CurrentInputQuery, CurrentInputQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentInputQuery, CurrentInputQueryVariables>(CurrentInputDocument, options);
      }
export function useCurrentInputLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentInputQuery, CurrentInputQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentInputQuery, CurrentInputQueryVariables>(CurrentInputDocument, options);
        }
// @ts-ignore
export function useCurrentInputSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CurrentInputQuery, CurrentInputQueryVariables>): Apollo.UseSuspenseQueryResult<CurrentInputQuery, CurrentInputQueryVariables>;
export function useCurrentInputSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentInputQuery, CurrentInputQueryVariables>): Apollo.UseSuspenseQueryResult<CurrentInputQuery | undefined, CurrentInputQueryVariables>;
export function useCurrentInputSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentInputQuery, CurrentInputQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentInputQuery, CurrentInputQueryVariables>(CurrentInputDocument, options);
        }
export type CurrentInputQueryHookResult = ReturnType<typeof useCurrentInputQuery>;
export type CurrentInputLazyQueryHookResult = ReturnType<typeof useCurrentInputLazyQuery>;
export type CurrentInputSuspenseQueryHookResult = ReturnType<typeof useCurrentInputSuspenseQuery>;
export type CurrentInputQueryResult = Apollo.QueryResult<CurrentInputQuery, CurrentInputQueryVariables>;
export const SetInputDocument = gql`
    mutation SetInput($input: HdmiInput!) {
  setInput(input: $input)
}
    `;
export type SetInputMutationFn = Apollo.MutationFunction<SetInputMutation, SetInputMutationVariables>;

/**
 * __useSetInputMutation__
 *
 * To run a mutation, you first call `useSetInputMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetInputMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setInputMutation, { data, loading, error }] = useSetInputMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetInputMutation(baseOptions?: Apollo.MutationHookOptions<SetInputMutation, SetInputMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetInputMutation, SetInputMutationVariables>(SetInputDocument, options);
      }
export type SetInputMutationHookResult = ReturnType<typeof useSetInputMutation>;
export type SetInputMutationResult = Apollo.MutationResult<SetInputMutation>;
export type SetInputMutationOptions = Apollo.BaseMutationOptions<SetInputMutation, SetInputMutationVariables>;