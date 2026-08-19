/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HdmiInput =
  | 'APPLE_TV'
  | 'PC'
  | 'PS3'
  | 'PS4'
  | 'SWITCH'
  | 'UNUSED_6'
  | 'UNUSED_7'
  | 'UNUSED_8';

export type InputsQueryVariables = Exact<{ [key: string]: never; }>;


export type InputsQuery = { inputs: Array<{ value: HdmiInput, label: string, icon: string, hoverText: string, isActive: boolean }> };

export type SetInputMutationVariables = Exact<{
  input: HdmiInput;
}>;


export type SetInputMutation = { setInput: HdmiInput };


export const InputsDocument = gql`
    query Inputs {
  inputs {
    value
    label
    icon
    hoverText
    isActive
  }
}
    `;

/**
 * __useInputsQuery__
 *
 * To run a query within a React component, call `useInputsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInputsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInputsQuery({
 *   variables: {
 *   },
 * });
 */
export function useInputsQuery(baseOptions?: Apollo.QueryHookOptions<InputsQuery, InputsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InputsQuery, InputsQueryVariables>(InputsDocument, options);
      }
export function useInputsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InputsQuery, InputsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InputsQuery, InputsQueryVariables>(InputsDocument, options);
        }
// @ts-ignore
export function useInputsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<InputsQuery, InputsQueryVariables>): Apollo.UseSuspenseQueryResult<InputsQuery, InputsQueryVariables>;
export function useInputsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InputsQuery, InputsQueryVariables>): Apollo.UseSuspenseQueryResult<InputsQuery | undefined, InputsQueryVariables>;
export function useInputsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InputsQuery, InputsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InputsQuery, InputsQueryVariables>(InputsDocument, options);
        }
export type InputsQueryHookResult = ReturnType<typeof useInputsQuery>;
export type InputsLazyQueryHookResult = ReturnType<typeof useInputsLazyQuery>;
export type InputsSuspenseQueryHookResult = ReturnType<typeof useInputsSuspenseQuery>;
export type InputsQueryResult = Apollo.QueryResult<InputsQuery, InputsQueryVariables>;
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