function quicksort_inplace(array) {
    if(array.length < 2) return array;

    var starts = [0],
        ends = [array.length - 1];

    while(starts.length > 0) {
        var start = starts.pop(),
            end = ends.pop(),
            pivot = array[start],
            storeIndex = start;

        // Move pivot to the end
        array[start] = array[end];
        array[end] = pivot;

        for (var currentIndex = start; currentIndex < end; currentIndex++) {
            var swapVal = array[currentIndex];
            if (swapVal < pivot) {
                array[currentIndex] = array[storeIndex];
                array[storeIndex] = swapVal;
                storeIndex++;
            }
        }

        // Move pivot back to the (new) pivot position
        array[end] = array[storeIndex];
        array[storeIndex] = pivot;

        if(end - storeIndex >= 2) {
            starts.push(storeIndex + 1);
            ends.push(end);
        }

        if(storeIndex - start >= 2) {
            starts.push(start);
            ends.push(storeIndex - 1);
        }
    }
    return array;
}

module.exports = quicksort_inplace;