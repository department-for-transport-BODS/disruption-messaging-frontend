import { Injectable } from '@angular/core';
import { IFeatureGQL, IAllFeaturesGQL, IFeatureFlagType } from 'src/generated/graphql';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(
    private featureGQL: IFeatureGQL,
    private allFeaturesGQL: IAllFeaturesGQL) { }

  getAllFeatures() {
    return this.allFeaturesGQL.fetch().pipe(take(1));
  }

  getFeature(name: string) {
    return this.featureGQL.fetch({name: name}).pipe(take(1));
  }
}
